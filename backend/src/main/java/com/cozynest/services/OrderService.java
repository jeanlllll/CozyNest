package com.cozynest.services;

import com.cozynest.Exceptions.ProductNotFoundException;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.auth.services.EmailService;
import com.cozynest.dtos.AddressDto;
import com.cozynest.dtos.OrderCancellationEmailDetail;
import com.cozynest.dtos.OrderProductDto;
import com.cozynest.dtos.OrderRequest;
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
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

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

    private final int FREE_STANDARD_TRANSPORTATION_FEE_MIN = 350;

    @Autowired
    EmailService emailService;

    @Transactional
    public Map<String, String> createCheckOutSession(OrderRequest orderRequest, UUID clientId) throws StripeException {

        float totalPrice = 0;

        Client client = clientRepository.findById(clientId).get();

        // 1. check productId exist, productVariant belongs to productId, stock quantity is enough and finally count total price
        float originalAmount = checkProductQuantityNCalPrice(orderRequest.getProductDtoList());
        totalPrice = originalAmount;

        // 2. check whether discount use and match discount usage requirement
        Discount discount = discountRepository.findByDiscountCode(orderRequest.getDiscountCode());
        float discountAmount = 0;
        if (discount != null) {
            discountAmount = checkDiscountAmount(originalAmount, discount);
        }
        totalPrice -= discountAmount;

        // 3. check transportation fee
        DeliveryMethod methodEnum = DeliveryMethod.valueOf(orderRequest.getDeliveryMethod());
        Delivery delivery = deliveryRepository.findByDeliveryMethod(methodEnum);
        float transportation_fee = checkTransportationFee(delivery, totalPrice);
        totalPrice -= transportation_fee;

        // 4. create order entity in database
        Order order = new Order();
        List<OrderProductDto> orderProductDtoList = orderRequest.getProductDtoList();
        removeProductFromCart(orderProductDtoList, clientId);
        List<OrderItem> orderItems = convertOrderProductDtoListToOrderItemList(orderProductDtoList, order);


        // 4. convert address dto to string
        String address = getAddressStringFromAddressDto(orderRequest.getShippingInfoDto().getAddress(), client);

        // 5. create order entity
        order.setOrderDate(LocalDateTime.now());
        order.setOriginalAmount(originalAmount);
        order.setTotalAmount(totalPrice);
        order.setDiscountAmount(discountAmount);
        order.setTransportationAmount(transportation_fee);
        order.setOrderStatus(OrderStatus.PRE_ORDER);
        order.setDiscountAmount(discountAmount);
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
                .setSuccessUrl(STRIPE_PAYMENT_SUCCESS_URL) //if stripe payment success, front end will return to this
                .setCancelUrl(STRIPE_PAYMENT_CANCEL_URL) //if stripe payment fail, front end will return to this
                .build();

        Session session = Session.create(params);

        // create payment entity in database
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentIntentId(session.getPaymentIntent());
        payment.setAmount(totalPrice);
        payment.setCurrency(Currency.HKD);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        order.setPayment(payment);
        paymentRepository.save(payment);
        orderRepository.save(order);

        return Map.of(
                "checkoutUrl", session.getUrl(),
                "sessionId", session.getId()
        );

    }

    private boolean checkStockAvailability(List<OrderItem> orderItemList) {
        for (OrderItem orderItem : orderItemList) {
            UUID productVariantId = orderItem.getProductVariant().getId();
            ProductVariant productVariant = productVariantRepository.findById(productVariantId)
                    .orElseThrow(() -> new EntityNotFoundException("Product Variant not found."));
            if (productVariant.getStockQuantity() < orderItem.getQuantity()) {
                return false;
            }
        }
        return true;
    }

    private void removeProductFromCart(List<OrderProductDto> orderProductDtoList, UUID clientId) {
        Client client = clientRepository.findById(clientId).get();

        if (client.getCart() == null) {
            Cart cart = new Cart();
            cart.setClient(client);
            client.setCart(cart);
            clientRepository.save(client);
        }

        List<CartItem> cartItemsList = client.getCart().getCartItems();

        Map<UUID, CartItem> cartItemMap = new HashMap<>();
        cartItemsList.stream().forEach(cartItem -> cartItemMap.put(cartItem.getId(), cartItem));

        cartItemsList.removeIf(cartItem -> orderProductDtoList.stream()
                .anyMatch(orderProductDto -> orderProductDto.getProductId().equals(cartItem.getProduct().getId())));
    }

    private float checkProductQuantityNCalPrice(List<OrderProductDto> productDtoList) {
        float totalPrice = 0;
        for (OrderProductDto productDto : productDtoList) {
            // 1. check whether product exist (by productId)
            Optional<Product> product = productRepository.findById(productDto.getProductId());
            if (!product.isPresent()) {
                throw new ProductNotFoundException("Product Id " + productDto.getProductId() + " is not found.");
            }

            // 2. check whether product variant id belongs to the product
            ProductVariant productVariant = productVariantRepository.findById(productDto.getProductVariantId()).
                    orElseThrow(() -> new EntityNotFoundException("Proudct Variant not found"));

            if (!productVariant.getProduct().getId().equals(productDto.getProductId())) {
                throw new EntityNotFoundException("Product variant Id does not belong to that product.");
            }

            // 3. check whether product variant stock quantity is enough
            if (productVariant.getStockQuantity() < productDto.getQuantity()) {
                throw new IllegalStateException("Quantity excess stock quantity.");
            }

            // 4. calculate total price
            totalPrice += product.get().getPrice() * productDto.getQuantity();
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

    private List<OrderItem> convertOrderProductDtoListToOrderItemList(List<OrderProductDto> orderProductDtoList, Order order) {
        List<OrderItem> orderItemsList = new ArrayList<>();
        for (OrderProductDto orderProductDto : orderProductDtoList) {
            ProductVariant productVariant = productVariantRepository.findByIdForUpdate(orderProductDto.getProductVariantId());

            Product product = productRepository.findById(orderProductDto.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found."));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .quantity(orderProductDto.getQuantity())
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


