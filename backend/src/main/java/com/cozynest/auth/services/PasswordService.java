package com.cozynest.auth.services;

import com.cozynest.auth.dtos.ChangePasswordRequest;
import com.cozynest.auth.dtos.EmailDetails;
import com.cozynest.auth.dtos.ResetPasswordRequest;
import com.cozynest.auth.entities.ShopUser;
import com.cozynest.auth.entities.Verification;
import com.cozynest.auth.entities.VerificationType;
import com.cozynest.auth.helper.VerificationCodeGenerator;
import com.cozynest.auth.repositories.ShopUserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

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

    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {

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

        if (!user.getIsVerified()) {
            return new ResponseEntity<>("Please verify your account first", HttpStatus.FORBIDDEN);
        }

        String currentPassword = changePasswordRequest.getCurrentPassword();
        String newPassword = changePasswordRequest.getNewPassword();

        if (bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            String encryptedPassword = bCryptPasswordEncoder.encode(newPassword);
            user.setPassword(encryptedPassword);
            shopUserRepository.save(user);
            return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
        } else if (bCryptPasswordEncoder.matches(newPassword, user.getPassword())) {
            return new ResponseEntity<>("New Password cannot be the same as the current password", HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>("Current Password is incorrect", HttpStatus.UNAUTHORIZED);
        }
    }

    public ResponseEntity<?> requestVerificationCode(String email) {
        if (email == null) {
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

        Verification newVerification = new Verification();
        newVerification.setType(VerificationType.EMAIL);
        newVerification.setCode(encryptedCode);
        newVerification.setExpiresAt(LocalDateTime.now().plusMinutes(verificationCodeExpireTime));
        user.setVerification(newVerification);

        return new ResponseEntity<>("Verification Code sent. Please check your email", HttpStatus.OK);
    }

    public ResponseEntity<?> resetPassword(ResetPasswordRequest resetPasswordRequest) {
        String email = resetPasswordRequest.getEmail();
        String verificationCode = resetPasswordRequest.getVerificationCode();
        String newPassword = resetPasswordRequest.getNewPassword();

        if (email == null || verificationCode == null || newPassword == null) {
            return new ResponseEntity<>("Email, verification code or new password cannot be blank", HttpStatus.BAD_REQUEST);
        }

        ShopUser user = shopUserRepository.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>("User cannot found", HttpStatus.NOT_FOUND);
        }
        if (bCryptPasswordEncoder.matches(newPassword, user.getPassword())) {
            return new ResponseEntity<>("New Password cannot be the same as the current password", HttpStatus.BAD_REQUEST);
        }

        Verification verification = user.getVerification();
        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new ResponseEntity<>("Verification Code expire, please request a new one.", HttpStatus.NOT_FOUND);
        }
        if (bCryptPasswordEncoder.matches(verificationCode, verification.getCode())) {
            String newEncryptedPassword = bCryptPasswordEncoder.encode(newPassword);
            user.setPassword(newEncryptedPassword);
            shopUserRepository.save(user);
            return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("verification code is incorrect", HttpStatus.UNAUTHORIZED);
    }
}
