package com.cozynest.auth.services;

import com.cozynest.auth.dtos.VerificationEmailDetail;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.dtos.EmailDetail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService{

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private ShopUserRepository shopUserRepository;

    @Value("${spring.mail.username}")
    private String sender;

    public boolean sendSimpleMail(EmailDetail details) {

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();

            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText(details.getMsgBody());
            mailMessage.setSubject(details.getSubject());

            javaMailSender.send(mailMessage);
            logger.info("Email sent successfully to {}", details.getRecipient());
            return true;
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", details.getRecipient(), e.getMessage());
            return false;
        }
    }

}
