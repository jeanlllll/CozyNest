package com.cozynest.auth.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name="shop_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShopUserUserType userType;

    @NotBlank(message = "First name cannot be blank")
    @Size(max = 30, message = "First name must not exceed 30 characters")
    @Column(nullable = false, length = 30)
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    @Size(max = 50, message = "Last name must not exceed 30 characters")
    @Column(nullable = false, length = 30)
    private String lastName;

    @NotBlank(message = "Password cannot be blank")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime createdOn;

    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime updatedOn;

    @Column(nullable = false)
    private String verificationCode;

    @Column(nullable = false)
    private Boolean isVerified = false;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name="auth_user_authority",
            joinColumns = @JoinColumn(name="shop_user_id"),
            inverseJoinColumns = @JoinColumn(name="auth_authority_id")
    )
    private Set<AuthAuthority> authorities;
}
