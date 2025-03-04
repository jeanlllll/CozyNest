package com.cozynest.auth.dtos;

import lombok.Data;

@Data
public class EmailDetails {

    private String recipient;
    private String msgBody;
    private String subject;

    public EmailDetails(String recipient, String verificationCode, String userName) {
        this.recipient = recipient;
        this.msgBody = "Hello "
                + userName + ",\n\n"
                + "Your verification code is " + verificationCode + ".\n\n"
                + "Please enter this code to verify your email.\n\n"
                + "CozyNest";
        this.subject = "Verify Your Account";
    }
}
