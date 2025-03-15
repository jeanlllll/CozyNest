package com.cozynest.dtos;

import lombok.Data;

import java.util.UUID;

@Data
public class OrderCancellationEmailDetail implements EmailDetail {

    private String recipient;
    private String msgBody;
    private String subject;

    public OrderCancellationEmailDetail(String recipient, String orderId, String userName) {
        this.recipient = recipient;
        this.msgBody = "Dear " + userName + ",\n\nYour order " +
                orderId + " has been canceled due to insufficient stock. A refund has been processed. \n\n" +
                "Sorry for the inconvenience caused.\n\n"
                + "CozyNest";
        this.subject = "Order Canceled - Refund Issued";
    }

}
