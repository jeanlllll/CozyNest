package com.cozynest.services;

import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.auth.services.EmailService;
import com.cozynest.dtos.OrderCancellationEmailDetail;
import com.cozynest.entities.orders.order.Order;
import com.cozynest.entities.orders.order.OrderItem;
import com.cozynest.entities.orders.order.OrderStatus;
import com.cozynest.entities.orders.payment.Payment;
import com.cozynest.entities.orders.payment.PaymentStatus;
import com.cozynest.entities.products.product.Product;
import com.cozynest.entities.products.product.ProductVariant;
import com.cozynest.repositories.OrderRepository;
import com.cozynest.repositories.PaymentRepository;
import com.cozynest.repositories.ProductVariantRepository;
import com.cozynest.repositories.SalesRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.RefundCreateParams;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WebhookService {

    @Value("${Stripe.webHook.secret}")
    String STRIPE_WEBHOOK_SECRET;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    ProductVariantRepository productVariantRepository;

    @Autowired
    SalesService salesService;

    @Autowired
    EmailService emailService;

    @Transactional
    public ResponseEntity<String> handleStripeWebhook(String payload, String sigHeader) throws StripeException {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, STRIPE_WEBHOOK_SECRET);
            ;
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Invalid signature.");
        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        if (!dataObjectDeserializer.getObject().isPresent()) {
            return ResponseEntity.badRequest().body("No data in event");
        }

        StripeObject stripeObject = dataObjectDeserializer.getObject().get();
        String eventType = event.getType();

        switch (eventType) {
            case "checkout.session.completed":
                return handleCheckoutSessionCompleted((Session) stripeObject);
            case "payment_intent.failed":
                return handlePaymentIntentFailed((PaymentIntent) stripeObject);
            case "checkout.session.expired":
                return handleCheckoutSessionExpired((Session) stripeObject);
            case "payment_intent.refund":

            default:
                return ResponseEntity.ok("Event received, but no handler for event type: " + eventType);
        }
    }


    private ResponseEntity<String> handleCheckoutSessionCompleted(Session session) throws StripeException {

        Order order = getOrderFromMetadata(session.getMetadata())
                .orElseThrow(() -> new EntityNotFoundException("Order Id not found."));

        Payment payment = order.getPayment();
        if (payment == null) {
            return ResponseEntity.badRequest().body("No payment entity found on order " + order.getId());
        }

        //set payment intention
        String paymentIntentionId = session.getPaymentIntent();
        payment.setPaymentIntentId(paymentIntentionId);

        try {
            if (paymentIntentionId != null) {
                PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentionId);
                String paymentMethodId = paymentIntent.getPaymentMethod();

                if (paymentMethodId != null) {
                    PaymentMethod pm = PaymentMethod.retrieve(paymentMethodId);
                    if (pm != null) {
                        payment.setPaymentMethod(pm.getType());
                    }
                }
            }
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

        List<OrderItem> orderItemList = order.getOrderItems();
        boolean isStockAvailable = updateStockQuantity(orderItemList);

        if (isStockAvailable) {
            checkProductIsOutOfStock(orderItemList);
            order.setOrderStatus(OrderStatus.IN_PROGRESS);
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
        } else {
            issueFullRefund(session);
            order.setOrderStatus(OrderStatus.CANCELLED);
            payment.setPaymentStatus(PaymentStatus.REFUND);
            sendRefundEmail(order);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        payment.setPaymentDate(LocalDateTime.now());

        orderRepository.save(order);
        paymentRepository.save(payment);

        if (!isStockAvailable) {
            return ResponseEntity.ok("Order " + order.getId() + "refund due to stock insufficient.");
        }

        salesService.updateSales(order);

        return ResponseEntity.ok("Order " + order.getId() + " is now " + order.getOrderStatus());
    }


    private ResponseEntity<String> handlePaymentIntentFailed(PaymentIntent paymentIntent) {
        String orderId = paymentIntent.getMetadata().get("orderId");

        if (orderId == null) {
            return ResponseEntity.badRequest().body("Missing orderId in session metadata.");
        }

        Order order = orderRepository.findById(UUID.fromString(orderId)).orElseThrow(() -> new EntityNotFoundException("Order not found."));
        Payment payment = order.getPayment();

        order.setOrderStatus(OrderStatus.CANCELLED);
        payment.setPaymentStatus(PaymentStatus.FAILURE);
        payment.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
        paymentRepository.save(payment);

        return ResponseEntity.ok("Payment failed. Order " + order.getId() + " has been cancelled.");
    }


    private ResponseEntity<String> handleCheckoutSessionExpired(Session session) {
        Order order = getOrderFromMetadata(session.getMetadata())
                .orElseThrow(() -> new EntityNotFoundException("Order Id not found."));

        Payment payment = order.getPayment();
        if (payment == null) {
            return ResponseEntity.badRequest().body("No payment entity found on order " + order.getId());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        payment.setPaymentStatus(PaymentStatus.EXPIRE);
        payment.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);
        paymentRepository.save(payment);

        return ResponseEntity.ok("Payment failed. Payment session expired.");
    }


    private Optional<Order> getOrderFromMetadata(Map<String, String> metadata) {
        String orderIdStr = metadata.get("orderId");
        if (orderIdStr == null) {
            return Optional.empty();
        }
        UUID orderId = UUID.fromString(orderIdStr);
        return orderRepository.findById(orderId);
    }


    private void sendRefundEmail(Order order) {
        ShopUser shopUser = shopUserRepository.findById(order.getClient().getId())
                .orElseThrow(() -> new EntityNotFoundException("ShopUser not found for client " + order.getClient().getId()));
        String email = shopUser.getEmail();
        String name = shopUser.getFirstName() + shopUser.getLastName();
        OrderCancellationEmailDetail emailDetail = new OrderCancellationEmailDetail(email, order.getId().toString(), name);
        emailService.sendSimpleMail(emailDetail);
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

    @Transactional
    private boolean updateStockQuantity(List<OrderItem> orderItemList) {
        // First loop: check stock
        for (OrderItem orderItem : orderItemList) {
            // This line locks one row in the DB
            UUID variantId = orderItem.getProductVariant().getId();
            ProductVariant variant = productVariantRepository.findByIdForUpdate(variantId);
            if (variant.getStockQuantity() < orderItem.getQuantity()) {
                return false; // insufficient -> fail early
            }
        }

        // second loop, still locking due to @Transactional
        for (OrderItem orderItem : orderItemList) {
            UUID productVariantId = orderItem.getProductVariant().getId();
            ProductVariant productVariant = productVariantRepository.findByIdForUpdate(productVariantId);
            productVariant.setStockQuantity(productVariant.getStockQuantity() - orderItem.getQuantity()); //auto release the lock
            productVariantRepository.save(productVariant);
        }
        return true;
        //lock will release after the parent class return
    }

    private void checkProductIsOutOfStock(List<OrderItem> orderItemList) {
        List<Product> productList = orderItemList.stream().map(orderItem -> orderItem.getProduct()).collect(Collectors.toList());
        for (Product product : productList) {
            List<ProductVariant> productVariantList = product.getProductVariants();
            boolean isOutOfStock = productVariantList.stream().allMatch(productVariant -> productVariant.getStockQuantity() <= 0);
            if (isOutOfStock) {
                product.setIsOutOfStock(true);
            }
        }
    }
}
