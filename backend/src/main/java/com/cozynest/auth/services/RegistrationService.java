package com.cozynest.auth.services;

import com.cozynest.auth.dts.EmailDetails;
import com.cozynest.auth.dts.RegistrationRequest;
import com.cozynest.auth.dts.RegistrationResponse;
import com.cozynest.auth.entities.Client;
import com.cozynest.auth.entities.ClientProvider;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.entities.ShopUserUserType;
import com.cozynest.auth.exceptions.RegistrationException;
import com.cozynest.auth.helper.VerificationCodeGenerator;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.auth.repositories.ShopUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RegistrationService {

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    EmailService emailService;

    @Value("${spring.mail.username}")
    private String ourEmail;

    public RegistrationResponse createUser(RegistrationRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new RegistrationResponse(400, "Passwords do not match."); //400 bad request
        }

        //TODO check password length and strength

        String email = request.getEmail();

        //if email has been registered before
        if (shopUserRepository.findByEmail(email) != null) {
            return new RegistrationResponse(400, "Email has been registered"); //400 bad request
        }

        //email has not been registered, create a new shopUser and client entities and store in database
        try {

            /* 1. create shopUser entity and client entity and store in database*/
            ShopUser shopUser = new ShopUser();
            shopUser.setUserType(ShopUserUserType.CLIENT);
            shopUser.setFirstName(request.getFirstName());
            shopUser.setLastName(request.getLastName());


            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12); //Bcrypt password
            String encryptedPassword = encoder.encode(request.getPassword());
            shopUser.setPassword(encryptedPassword);

            shopUser.setEmail(email);
            shopUser.setCreatedOn(LocalDateTime.now());

            String verificationCode = VerificationCodeGenerator.generateVerificationCode();
            shopUser.setVerificationCode(verificationCode);

            Client client = new Client();
            client.setProvider(ClientProvider.MANUAL);
            client.setUser(shopUser);

            shopUserRepository.save(shopUser);
            clientRepository.save(client);

            /* 2. send verification code to client email*/
            EmailDetails emailDetails = new EmailDetails(email, verificationCode, request.getFirstName());
            int returnStatus = emailService.sendSimpleMail(emailDetails);
            if (returnStatus == 200) {
                return new RegistrationResponse(200, "User created. Please verify your code");
            } else {
                return new RegistrationResponse(400, "Oops. Seems like something went wrong. Please contact us via email " + ourEmail);
            }
        } catch (Exception e) {
            throw new RegistrationException(e.getMessage(), e);
        }
    }
}
