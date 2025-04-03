package com.cozynest.services;

import com.cozynest.Exceptions.CartItemNotFoundException;
import com.cozynest.Exceptions.ProductNotFoundException;
import com.cozynest.Helper.RoundNumberToTwoDecimalHelper;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.auth.services.EmailService;
import com.cozynest.dtos.*;
import com.cozynest.entities.orders.discount.Discount;
import com.cozynest.entities.orders.discount.DiscountType;
import com.cozynest.entities.orders.order.*;
import com.cozynest.entities.orders.payment.Currency;
import com.cozynest.entities.orders.payment.Payment;
import com.cozynest.entities.orders.payment.PaymentStatus;
import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductVariant;
import com.cozynest.entities.profiles.Address;
import com.cozynest.entities.profiles.cart.Cart;
import com.cozynest.entities.profiles.cart.CartItem;
import com.cozynest.repositories.*;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductVariantRepository productVariantRepository;

    @Autowired
    DiscountRepository discountRepository;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    ClientProfileService clientProfileService;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    DeliveryRepository deliveryRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Value("${Stripe.payment.success.url}")
    String STRIPE_PAYMENT_SUCCESS_URL;

    @Value("${Stripe.payment.cancel.url}")
    String STRIPE_PAYMENT_CANCEL_URL;

    private final int FREE_STANDARD_TRANSPORTATION_FEE_MIN = 300;

    @Autowired
    EmailService emailService;

    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    CartRedisService cartRedisService;

    @Autowired
    RoundNumberToTwoDecimalHelper roundNumberToTwoDecimalHelper;

    @Transactional
    public Map<String, String> createCheckOutSession(OrderRequest orderRequest, UUID clientId) throws StripeException {

        float totalPrice = 0;

        Client client = clientRepository.findById(clientId).get();

        // 1.check cartItem exists in cart Items list and product quantity is enough or not and cal the price
        float originalAmount = checkProductQuantityNCalPrice(orderRequest.getOrderCartItemDtoList(), clientId);
        totalPrice = originalAmount;
        System.out.println(originalAmount);

        // 2. check promotion Discount Amount;
        List<OrderCartItemDto> orderCartItemDtoList = orderRequest.getOrderCartItemDtoList();
        float promotionDiscountPercent = checkPromotionDiscountAmount(orderCartItemDtoList);
        float promotionDiscountAmount = totalPrice - totalPrice * promotionDiscountPercent;
        totalPrice -= promotionDiscountAmount;
        System.out.println(promotionDiscountAmount);

        // 3. check whether discount use and match discount usage requirement
        Discount discount = discountRepository.findByDiscountCode(orderRequest.getDiscountCode());
        float discountAmount = 0;
        if (discount != null) {
            discountAmount = checkDiscountAmount(originalAmount-promotionDiscountAmount, discount);
        }
        totalPrice -= discountAmount;
        System.out.println(discountAmount);

        // 4. check transportation fee
        DeliveryMethod methodEnum = DeliveryMethod.valueOf(orderRequest.getDeliveryMethod());
        Delivery delivery = deliveryRepository.findByDeliveryMethod(methodEnum);
        float transportation_fee = checkTransportationFee(delivery, totalPrice);
        totalPrice += transportation_fee;
        System.out.println(transportation_fee);

        // 5. create order entity in database
        Order order = new Order();
        List<OrderCartItemDto> orderProductDtoList = orderRequest.getOrderCartItemDtoList();
        removeProductFromCart(orderProductDtoList, clientId);
        List<OrderItem> orderItems = convertOrderProductDtoListToOrderItemList(orderProductDtoList, order);


        // 6. convert address dto to string
        String address = getAddressStringFromAddressDto(orderRequest.getShippingInfoDto().getAddress(), client);

        // 7. create order entity
        order.setOrderDate(LocalDateTime.now());
        order.setOriginalAmount(roundNumberToTwoDecimalHelper.roundNumberToTwoDecimalFloatNumber(originalAmount));
        order.setTotalAmount(roundNumberToTwoDecimalHelper.roundNumberToTwoDecimalFloatNumber(totalPrice));
        order.setPromotionDiscountAmount(roundNumberToTwoDecimalHelper.roundNumberToTwoDecimalFloatNumber(promotionDiscountAmount));
        order.setTransportationAmount(roundNumberToTwoDecimalHelper.roundNumberToTwoDecimalFloatNumber(transportation_fee));
        order.setOrderStatus(OrderStatus.PRE_ORDER);
        order.setDiscountAmount(roundNumberToTwoDecimalHelper.roundNumberToTwoDecimalFloatNumber(discountAmount));
        order.setClient(client);
        order.setAddress(address);
        order.setDiscount(discount);
        order.setOrderItems(orderItems);
        order.setDelivery(delivery);
        order.setPhoneNumber(orderRequest.getShippingInfoDto().getPhoneNumber());

        orderRepository.save(order);

        // 5. create session intention

        long amountInCents = (long) (totalPrice * 100);

        // Create a single line item with a generic description
        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                .setQuantity(1L) //just one entry representing the entire order
                .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("hkd")
                                .setUnitAmount(amountInCents)
                                .setProductData(
                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                .setName("Order Payment")
                                                .build()
                                ).
                                build()
                )
                .build();

        //create the checkout session
        SessionCreateParams params = SessionCreateParams.builder()
                .setCustomerEmail(shopUserRepository.findById(clientId).get().getEmail())
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .addLineItem(lineItem)
                .putMetadata("orderId", order.getId().toString())
                .setSuccessUrl(STRIPE_PAYMENT_SUCCESS_URL + "?session_id={CHECKOUT_SESSION_ID}") //if stripe payment success, front end will return to this
                .setCancelUrl(STRIPE_PAYMENT_CANCEL_URL) //if stripe payment fail, front end will return to this
                .build();

        Session session = Session.create(params);

        // create payment entity in database
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentIntentId(session.getPaymentIntent());
        payment.setAmount(roundNumberToTwoDecimalHelper.roundNumberToTwoDecimalFloatNumber(totalPrice));
        payment.setCurrency(Currency.HKD);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setSessionId(session.getId());
        order.setPayment(payment);
        paymentRepository.save(payment);
        orderRepository.save(order);

        return Map.of(
                "checkoutUrl", session.getUrl()
        );

    }

    /* check promotion Discount here --- buy 3 items get 10% off */
    private float checkPromotionDiscountAmount(List<OrderCartItemDto> orderCartItemDtoList) {
        if (orderCartItemDtoList.size() > 3) {
            return 0.9F;
        }
        else return 1.0F;
    }

    private void removeProductFromCart(List<OrderCartItemDto> orderProductDtoList, UUID clientId) {

        Set<UUID> cartItemIdSet = new HashSet<>();
        orderProductDtoList.stream().forEach(orderCartItemDto -> cartItemIdSet.add(orderCartItemDto.getCartItemId()));

        Client client = clientRepository.findById(clientId).get();
        List<CartItem> cartItemList = client.getCart().getCartItems();
        cartItemList.removeIf(cartItem -> cartItemIdSet.contains(cartItem.getId()));
    }

    private float checkProductQuantityNCalPrice(List<OrderCartItemDto> orderCartItemDtoList, UUID userId) {
        float totalPrice = 0;
        List<CartItemDto> cartItemDtos = cartRedisService.getCartList(userId);
        for (OrderCartItemDto cartItemDto : orderCartItemDtoList) {

            // 1. check whether cart items exists in cart items list
            Optional<CartItem> cartItem = cartItemRepository.findById(cartItemDto.getCartItemId());
            if (!cartItem.isPresent()) {
                throw new CartItemNotFoundException("Cart item cannot be found cart item list");
            }

            // 2. check whether product exist (by productId)
            Product product = cartItem.get().getProduct();
            if (product == null) {
                throw new ProductNotFoundException("Product Id " + product.getId() + " is not found.");
            }

            // 3. check whether product variant id belongs to the product
            ProductVariant productVariant = cartItem.get().getProductVariant();
            if (productVariant == null) {
                throw new ProductNotFoundException("Product Variant Id " + product.getId() + " is not found.");
            }

            // 4. check whether product variant stock quantity is enough
            if (cartItem.get().getQuantity() <= 0 && productVariant.getStockQuantity() < cartItem.get().getQuantity()) {
                throw new IllegalStateException("Quantity excess stock quantity.");
            }

            if (cartItemDto.getQuantity() != cartItem.get().getQuantity()) {
                cartItem.get().setQuantity(cartItemDto.getQuantity());
            }

            cartItemDtos = cartItemDtos.stream().filter(dto -> dto.getCartItemId().equals(cartItemDto.getCartItemId())).collect(Collectors.toList());

            // 5. calculate total price
            totalPrice += product.getPrice() * cartItemDto.getQuantity();

            //6. update new cart item list to redis
            cartRedisService.saveCartItemsList(userId, cartItemDtos);
        }

        return totalPrice;
    }

    private float checkDiscountAmount(float totalPrice, Discount discount) {
        if (discount.getDiscountType().equals(DiscountType.AMOUNT) && totalPrice >= discount.getMinPurchaseAmount() && discount.getExpireDate().isAfter(LocalDate.now())) {
            return discount.getDiscountValue();
        } else if (discount.getDiscountType().equals(DiscountType.PERCENTAGE) && totalPrice >= discount.getMinPurchaseAmount() && discount.getExpireDate().isAfter(LocalDate.now())) {
            return totalPrice * (discount.getDiscountValue()/100.0f);
        } else {
            return 0.0f;
        }
    }

    private List<OrderItem> convertOrderProductDtoListToOrderItemList(List<OrderCartItemDto> orderCartItemDtoList, Order order) {
        List<OrderItem> orderItemsList = new ArrayList<>();
        for (OrderCartItemDto orderCartItemDto : orderCartItemDtoList) {
            CartItem cartItem = cartItemRepository.findById(orderCartItemDto.getCartItemId()).get();
            Product product = cartItem.getProduct();
            ProductVariant productVariant = cartItem.getProductVariant();

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .quantity(orderCartItemDto.getQuantity())
                    .product(product)
                    .productVariant(productVariant)
                    .build();

            orderItemsList.add(orderItem);
        }
        return orderItemsList;
    }

    // if cliet's list of address size is larger than maximun address size, remove the first one
    private String getAddressStringFromAddressDto(AddressDto addressDto, Client client) {
        Address address = null;

        if (addressDto.getAddressId() != null && !addressDto.getAddressId().toString().trim().isEmpty()) {
            addressRepository.findById(addressDto.getAddressId())
                    .orElseThrow(() -> new EntityNotFoundException("Address Id is not found."));
        } else {
            address = new Address();
        }

        List<Address> addressList = client.getAddressList();

        if (addressList.size() >= clientProfileService.SORTED_ADDRESS_LIMIT) {
            Address removeAddress = addressList.remove(0);
            addressRepository.deleteById(removeAddress.getId());
        }

        addressList.add(address);

        clientProfileService.udpateAddressDtoInAddress(addressDto, address);
        address.setClient(client);
        return address.toString();
    }

    private float checkTransportationFee(Delivery delivery, float totalPrice) {
        if (delivery.getDeliveryMethod().equals(DeliveryMethod.STANDARD) && totalPrice >= FREE_STANDARD_TRANSPORTATION_FEE_MIN) {
            return 0.0f;
        } else {
            return delivery.getTransportationFee();
        }
    }
}


