package com.cozynest.auth.services;

import com.cozynest.auth.dtos.EmailDetails;
import com.cozynest.auth.dtos.RegistrationRequest;
import com.cozynest.auth.dtos.RegistrationResponse;
import com.cozynest.auth.entities.*;
import com.cozynest.auth.exceptions.RegistrationException;
import com.cozynest.auth.helper.VerificationCodeGenerator;
import com.cozynest.auth.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class RegistrationService {

    /*
        verification code expire in 15 minutes
     */

    @Value("${verificationCode.expire.time}")
    Integer verificationCodeExpireTime;

    @Autowired
    ShopUserRepository shopUserRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    AuthAuthorityRepository authorityRepository;

    @Value("${spring.mail.username}")
    private String ourEmail;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    VerificationRepository verificationRepository;

    @Autowired
    ClientProvidersRepository clientProvidersRepository;

    public RegistrationResponse createUser(RegistrationRequest request, ClientProvider clientProvider) {

        String firstName = request.getFirstName();
        String lastName = request.getLastName();
        String email = request.getEmail();
        String password = request.getPassword();
        String confirmedPassword = request.getConfirmPassword();

        if (clientProvider.equals(ClientProvider.MANUAL)) {
            if (firstName == null || lastName == null || email == null || password == null || confirmedPassword == null) {
                return new RegistrationResponse(400, "First name, last name, email, passowrd, confirmed password cannot be blank");
            }
            if (!password.equals(confirmedPassword)) {
                return new RegistrationResponse(400, "Passwords do not match."); //400 bad request
            }
        }

        //TODO check password length and strength


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

            if (clientProvider.equals(ClientProvider.MANUAL)) {
                String encryptedPassword = bCryptPasswordEncoder.encode(request.getPassword());
                shopUser.setPassword(encryptedPassword);
            }

            shopUser.setEmail(email);
            Client client = new Client();
            shopUser.setCreatedOn(LocalDateTime.now());


            String verificationCode = VerificationCodeGenerator.generateVerificationCode();
            String encryptedCode = bCryptPasswordEncoder.encode(verificationCode);
            Verification verification = new Verification();
            verification.setCode(encryptedCode);
            verification.setExpiresAt(LocalDateTime.now().plusMinutes(verificationCodeExpireTime));
            verification.setType(VerificationType.EMAIL);
            shopUser.setVerification(verification);
            verificationRepository.save(verification);


            AuthAuthority authority = authorityRepository.findByRoleCode("NORMAL_CUSTOMER");
            if (authority == null) {
                return new RegistrationResponse(500, "Role not found"); // Internal Server Error
            }
            shopUser.setAuthorities(new HashSet<>());
            shopUser.getAuthorities().add(authority);
            shopUserRepository.save(shopUser);

            client.setShopUser(shopUser);
            clientRepository.save(client);

            ClientProviders clientProviders = new ClientProviders();
            clientProviders.setId(new ClientProvidersId(client.getId(), clientProvider));
            clientProviders.setClient(client);
            clientProvidersRepository.save(clientProviders);

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

    public boolean isRegistered(String email) {
        return shopUserRepository.findByEmail(email) != null;
    }
}
