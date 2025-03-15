package com.cozynest.entities.orders.order;

public enum OrderStatus {

    PRE_ORDER,
    IN_PROGRESS, //when order is paid, it will turn to in progress status
    SHIPPED,
    COMPLETED,
    CANCELLED
}
