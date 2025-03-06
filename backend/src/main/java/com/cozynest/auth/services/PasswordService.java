package com.cozynest.auth.services;

import com.cozynest.auth.dtos.ChangePasswordRequest;
import com.cozynest.auth.dtos.EmailDetails;
import com.cozynest.auth.dtos.ResetPasswordRequest;
import com.cozynest.auth.entities.*;
import com.cozynest.auth.helper.PasswordValidator;
import com.cozynest.auth.helper.VerificationCodeGenerator;
import com.cozynest.auth.repositories.ClientProvidersRepository;
import com.cozynest.auth.repositories.ClientRepository;
import com.cozynest.auth.repositories.ShopUserRepository;
import com.cozynest.auth.repositories.VerificationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PasswordService {

    @Value("${verificationCode.expire.time}")
    Integer verificationCodeExpireTime;

    @Autowired
    private ShopUserRepository shopUserRepository;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    VerificationCodeGenerator verificationCodeGenerator;

    @Autowired
    EmailService emailService;

    @Autowired
    PasswordValidator passwordValidator;

    @Autowired
    VerificationRepository verificationRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    ClientProvidersRepository clientProvidersRepository;

    //change password for admin and user
    public ResponseEntity<?> changePassword(ChangePasswordRequest changePasswordRequest, ShopUserUserType userType) {

        if (changePasswordRequest.getConfirmPassword().equals(changePasswordRequest.getNewPassword())) {
            return new ResponseEntity<>("New password and confirm password do not match.", HttpStatus.BAD_GATEWAY);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>("Account not yet login.", HttpStatus.UNAUTHORIZED);
        }

        String email = (String) authentication.getPrincipal();

        if (email == null) {
            return new ResponseEntity<>("Account not yet login.", HttpStatus.UNAUTHORIZED);
        }

        ShopUser user = shopUserRepository.findByEmail(email);

        if (user == null) {
            return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        }

        // client did not set manual login, no old password data in database for that client
        if (userType.equals(ShopUserUserType.CLIENT)) {
            if (user.getClient() == null) {
                return new ResponseEntity<>("Client data missing.", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            Set<ClientProvider> registeredProviders = user.getClient().getClientProviders().stream()
                    .map(cp -> cp.getId().getClientProvider())
                    .collect(Collectors.toSet());
            if (!registeredProviders.contains(ClientProvider.MANUAL)) {
                return new ResponseEntity<>("Please enable manual login first.", HttpStatus.FORBIDDEN);
            }
        }

        if (!user.getIsVerified()) {
            return new ResponseEntity<>("Please verify your account first", HttpStatus.FORBIDDEN);
        }

        String currentPassword = changePasswordRequest.getCurrentPassword();
        String newPassword = changePasswordRequest.getNewPassword();

        // new password format not correct
        if (!passwordValidator.isValidPassword(newPassword)) {
            return new ResponseEntity<>("New password format does not match requirements.", HttpStatus.BAD_REQUEST);
        }

        // current password not match
        if (!bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            return new ResponseEntity<>("Current Password is incorrect.", HttpStatus.UNAUTHORIZED);
        } else {
            // new password same as old password
            if (bCryptPasswordEncoder.matches(newPassword, user.getPassword())) {
                return new ResponseEntity<>("New Password cannot be the same as the current password", HttpStatus.BAD_REQUEST);
            }
        }

        // update new password
        String encryptedPassword = bCryptPasswordEncoder.encode(newPassword);
        user.setPassword(encryptedPassword);
        shopUserRepository.save(user);
        return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
    }


    public ResponseEntity<?> requestVerificationCode(String email) {
        if (email == null || email.trim().isEmpty()) {
            return new ResponseEntity<>("Email cannot be blank.", HttpStatus.BAD_REQUEST);
        }

        ShopUser user = shopUserRepository.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        }

        String verificationCode = VerificationCodeGenerator.generateVerificationCode();
        EmailDetails emailDetails = new EmailDetails(user.getEmail(), verificationCode, user.getEmail());
        emailService.sendSimpleMail(emailDetails);

        String encryptedCode = bCryptPasswordEncoder.encode(verificationCode);
        Verification verification = user.getVerification();

        if (verification == null) {
            verification = new Verification();
            verification.setShopUser(user);
        }
        verification.setCode(encryptedCode);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(verificationCodeExpireTime));
        verificationRepository.save(verification);

        return new ResponseEntity<>("Verification Code sent. Please check your email", HttpStatus.OK);
    }


    public ResponseEntity<?> resetPassword(ResetPasswordRequest resetPasswordRequest) {
        String email = resetPasswordRequest.getEmail();
        String verificationCode = resetPasswordRequest.getVerificationCode();
        String newPassword = resetPasswordRequest.getNewPassword();
        String confirmPassword = resetPasswordRequest.getConfirmPassword();

        if (email == null || verificationCode == null || newPassword == null || confirmPassword == null) {
            return new ResponseEntity<>("Email, verification code or new password cannot be blank", HttpStatus.BAD_REQUEST);
        }

        if (!newPassword.equals(confirmPassword)) {
            return new ResponseEntity<>("New password and confirm password do not match.", HttpStatus.BAD_REQUEST);
        }

        // new password format not correct
        if (!passwordValidator.isValidPassword(newPassword)) {
            return new ResponseEntity<>("New password format does not match requirements.", HttpStatus.BAD_REQUEST);
        }

        ShopUser user = shopUserRepository.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("User cannot found", HttpStatus.NOT_FOUND);
        }
        if (bCryptPasswordEncoder.matches(newPassword, user.getPassword())) {
            return new ResponseEntity<>("New Password cannot be the same as the current password", HttpStatus.BAD_REQUEST);
        }

        Verification verification = user.getVerification();
        if (verification == null) {
            return new ResponseEntity<>("Verification code not found. Please request a new one.", HttpStatus.NOT_FOUND);
        }

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new ResponseEntity<>("Verification Code expire, please request a new one.", HttpStatus.NOT_FOUND);
        }

        if (!bCryptPasswordEncoder.matches(verificationCode, verification.getCode())){
            return new ResponseEntity<>("Verification Code is incorrect", HttpStatus.UNAUTHORIZED);
        }

        Set<ClientProviders> clientProviders = user.getClient().getClientProviders();
        Set<ClientProvider> registeredProviders = clientProviders.stream()
                .map(cp -> cp.getId().getClientProvider())
                .collect(Collectors.toSet());

        if (!registeredProviders.contains(ClientProvider.MANUAL)) {
            user.setIsVerified(true);
            Client client = user.getClient();
            ClientProviders clientProvider = new ClientProviders();
            clientProvider.setId(new ClientProvidersId(user.getId(), ClientProvider.MANUAL));
            clientProvider.setClient(client);
            clientProvidersRepository.save(clientProvider);
            client.getClientProviders().add(clientProvider);
            clientRepository.save(client);
        }

        String newEncryptedPassword = bCryptPasswordEncoder.encode(newPassword);
        user.setPassword(newEncryptedPassword);
        shopUserRepository.save(user);
        return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
    }
}
