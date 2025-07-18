package com.cozynest.auth.services;

import com.cozynest.auth.dtos.VerificationEmailDetail;
import com.cozynest.auth.dtos.RegistrationRequest;
import com.cozynest.auth.dtos.RegistrationResponse;
import com.cozynest.auth.entities.*;
import com.cozynest.auth.exceptions.RegistrationException;
import com.cozynest.auth.helper.PasswordValidator;
import com.cozynest.auth.helper.VerificationCodeGenerator;
import com.cozynest.auth.repositories.*;
import com.cozynest.entities.profiles.favorites.Favorite;
import com.cozynest.repositories.FavoriteRepository;
import com.cozynest.services.SubscriptionService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
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
    ClientProviderRepository clientProviderRepository;

    @Autowired
    PasswordValidator passwordValidator;

    @Autowired
    VerifyEmailService verifyEmailService;

    @Autowired
    SubscriptionService subscriptionService;

    public RegistrationResponse createUser(RegistrationRequest request, HttpServletResponse response, AuthProvider clientProvider) {

        String firstName = request.getFirstName();
        String lastName = request.getLastName();
        String email = request.getEmail();
        String password = request.getPassword();
        String confirmedPassword = request.getConfirmPassword();

        // for manual register type
        if (clientProvider.equals(AuthProvider.MANUAL)) {
            // for manual registration, registration request info cannot be blank
            if (isBlank(firstName) || isBlank(lastName) || isBlank(email) || isBlank(password) || isBlank(confirmedPassword)) {
                return new RegistrationResponse(400, "First name, last name, email, password, confirmed password cannot be blank");
            }
            // if password and confirmed password not matched, reject request
            if (!password.equals(confirmedPassword)) {
                return new RegistrationResponse(400, "Passwords do not match."); //400 bad request
            }
            if (!passwordValidator.isValidPassword(password)) {
                return new RegistrationResponse(400, "Password format not matched.");
            }
        }

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
            shopUser.setEmail(email);
            shopUser.setCreatedOn(LocalDateTime.now());

            // for manual register type, only manual registration has password, oauth2 register does not have, and only manual register
            // need to verify email
            if (clientProvider.equals(AuthProvider.MANUAL)) {
                //set password
                String encryptedPassword = bCryptPasswordEncoder.encode(request.getPassword());
                shopUser.setPassword(encryptedPassword);
            }

            shopUserRepository.save(shopUser);

            if (clientProvider.equals(AuthProvider.MANUAL)) {
                //set verification code
                String verificationCode = VerificationCodeGenerator.generateVerificationCode();
                Verification verification = createNewVerificationObject(shopUser, verificationCode);
                shopUser.setVerification(verification);
                shopUserRepository.save(shopUser);

                //send verification code via email
                VerificationEmailDetail verificationEmailDetail = new VerificationEmailDetail(email, verificationCode, request.getFirstName());
                emailService.sendSimpleMail(verificationEmailDetail);
            }

            //assign role
            AuthAuthority authority = authorityRepository.findByRoleCode("CLIENT");
            if (authority == null) {
                return new RegistrationResponse(500, "Role not found"); // Prevent saving a user without roles
            }

            // set authorities
            Set<AuthAuthority> authorities = new HashSet<>();
            authorities.add(authority);
            shopUser.setAuthorities(authorities);
            shopUserRepository.save(shopUser);

            // create client and link to shopUser
            Client client = new Client();
            client.setShopUser(shopUser);

            // set favorite
            Favorite favorite = new Favorite();
            favorite.setClient(client);
            client.setFavorite(favorite);
            clientRepository.save(client);

            // register client provider
            ClientProvider newClientProvider = new ClientProvider();
            newClientProvider.setId(new ClientProviderId(client.getId(), clientProvider));
            newClientProvider.setClient(client);
            clientProviderRepository.save(newClientProvider);

            Set<ClientProvider> clientProviderSet = new HashSet<>();
            clientProviderSet.add(newClientProvider);
            client.setClientProviders(clientProviderSet);
            clientRepository.save(client);

            // Return success messages
            if (clientProvider.equals(AuthProvider.MANUAL)) {
                subscriptionService.addToSubscription(email);
                // Manual: user needs to verify
                return new RegistrationResponse(200, "User created. Please verify your code. " +
                        "The email may take 1-2 minutes to arrive.");
            } else {
                verifyEmailService.generateTokenToCookie(email, response, shopUser);
                // OAuth or other
                return new RegistrationResponse(200, "Google oauth2 register success.");
            }

        } catch (Exception e) {
            throw new RegistrationException(e.getMessage(), e);
        }
    }

    public boolean isRegistered(String email) {
        return shopUserRepository.findByEmail(email) != null;
    }

    private boolean isBlank(String str) {
        return str == null || str.trim().isEmpty();
    }

    private Verification createNewVerificationObject(ShopUser user, String verificationCode) {
        Verification verification = new Verification();
        String bcryptCode = bCryptPasswordEncoder.encode(verificationCode);
        verification.setCode(bcryptCode);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(verificationCodeExpireTime));
        verification.setShopUser(user);
        verificationRepository.save(verification);
        return verification;
    }
}
