package com.cozynest.services;

import com.cozynest.Exceptions.ProductNotFoundException;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.auth.services.EmailService;
import com.cozynest.controllers.OrderController;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @Value("${Stripe.webHook.secret}")
    String STRIPE_WEBHOOK_SECRET;

    @Autowired
    EmailService emailService;

    final private float FREE_STANDARD_TRANSPORTATION_FEE_MIN = 350;

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

        //create the checkout session with expiration time (15 min)
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

    @Transactional
    public ResponseEntity<String> handleStripeWebhook(String payload, String sigHeader) {
        System.out.println(payload +  sigHeader);
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, STRIPE_WEBHOOK_SECRET);;
        } catch (SignatureVerificationException e) {
            System.out.println("Invalid Signature");
            return ResponseEntity.badRequest().body("Invalid signature.");
        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        if (!dataObjectDeserializer.getObject().isPresent()) {
            return ResponseEntity.badRequest().body("No data in event");
        }

        StripeObject stripeObject = dataObjectDeserializer.getObject().get();
        String eventType = event.getType();

        if ("checkout.session.completed".equals(eventType)) {
            Session session = (Session) stripeObject;

            String orderIdStr = session.getMetadata().get("orderId");
            if (orderIdStr == null) {
                return ResponseEntity.badRequest().body("Missing orderId in session metadata.");
            }

            UUID orderId = UUID.fromString(orderIdStr);
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + orderId));
            Payment payment = order.getPayment();
            if (payment == null) {
                return ResponseEntity.badRequest().body("No payment entity found on order " + orderId);
            }

            boolean isUpdateSuccess = updateStockQuantity(order.getOrderItems());
            if (!isUpdateSuccess) {
                // stock insufficient, Refund the whole order
                try {
                    issueFullRefund(session);
                } catch (StripeException e) {
                    return ResponseEntity.internalServerError()
                            .body("Failed to refund order. " + orderId + "Refund reason - stock shortage.");
                }

                order.setOrderStatus(OrderStatus.CANCELLED);
                payment.setPaymentStatus(PaymentStatus.REFUND);
                payment.setUpdatedAt(LocalDateTime.now());

                orderRepository.save(order);
                paymentRepository.save(payment);

                //after refund, send email to notify the user
                ShopUser shopUser = shopUserRepository.findById(order.getClient().getId())
                        .orElseThrow(() -> new EntityNotFoundException("ShopUser not found for client " + order.getClient().getId()));
                String email = shopUser.getEmail();
                String name = shopUser.getFirstName() + shopUser.getLastName();
                OrderCancellationEmailDetail emailDetail = new OrderCancellationEmailDetail(email, orderId.toString(), name);
                emailService.sendSimpleMail(emailDetail);

                // 📡TODO Notify frontend using WebSocket
//                    messagingTemplate.convertAndSend("/topic/orderStatus", "Order " + orderId + " has been refunded.");

                return ResponseEntity.ok("Order canceled due to insufficient stock. Refund issued.");
            }

            order.setOrderStatus(OrderStatus.IN_PROGRESS);
            orderRepository.save(order);

            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setUpdatedAt(LocalDateTime.now());

            //get payment method
            String getPaymentIntentionId = session.getPaymentIntent();
            String userPaymentMethod = "UNKNOWN";  // Default value

            try {
                if (getPaymentIntentionId != null) {
                    PaymentIntent paymentIntent = PaymentIntent.retrieve(getPaymentIntentionId);
                    String paymentMethodId = paymentIntent.getPaymentMethod();

                    if (paymentMethodId != null) {
                        PaymentMethod pm = PaymentMethod.retrieve(paymentMethodId);

                        if (pm != null && pm.getType() != null) {
                            userPaymentMethod = pm.getType();  // ✅ Assign correctly
                        }
                    }
                }
            } catch (StripeException e) {
                throw new RuntimeException(e);
            }

            paymentRepository.save(payment);

            return ResponseEntity.ok("Order " + orderId + " is in progress.");
        }
        if (eventType.equals("payment_intent.failed") || eventType.equals("checkout.session.expired")) {
//            order.setOrderStatus(OrderStatus.CANCELLED);
//            payment.setPaymentStatus(PaymentStatus.FAILURE);
//            payment.setUpdatedAt(LocalDateTime.now());
        }

        return ResponseEntity.ok("Webhook received.");
    }

    private void issueFullRefund(Session stripeObject) throws StripeException {
        try {
            RefundCreateParams refundParams = RefundCreateParams.builder()
                    .setPaymentIntent(stripeObject.getPaymentIntent())
                    .build();
            Refund.create(refundParams);
        } catch (StripeException e) {
            throw e;
        }
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

    private boolean updateStockQuantity(List<OrderItem> orderItemList) {
        for (OrderItem orderItem : orderItemList) {
            UUID productVariantId = orderItem.getProductVariant().getId();
            ProductVariant productVariant = productVariantRepository.findByIdForUpdate(productVariantId);

            if (productVariant.getStockQuantity() < orderItem.getQuantity()) {
                return false;
            }

            productVariant.setStockQuantity(productVariant.getStockQuantity() - orderItem.getQuantity()); //auto release the lock
            productVariantRepository.save(productVariant);
        }
        return true;
    }

    private void removeProductFromCart(List<OrderProductDto> orderProductDtoList, UUID clientId) {
        Client client = clientRepository.findById(clientId).get();

        if (client.getCart() == null || client.getCart().getCartItems() == null) {
            throw new IllegalStateException("Cart is empty or not initialized.");
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


