package com.cozynest.auth.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
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

    private String password;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime createdOn;

    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime updatedOn;

    @OneToOne(mappedBy = "shopUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Verification verification;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private Integer loginFailedAttempts = 0;

    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime lastLoginAttemptsDate;

    @Builder.Default
    private Boolean isLocked = false;

    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime lockExpiresAt;

    @ManyToMany(cascade = CascadeType.PERSIST) //auto save new authAuthority when saving shopUser
    @JoinTable(
            name="auth_user_authority",
            joinColumns = @JoinColumn(name="shop_user_id"),
            inverseJoinColumns = @JoinColumn(name="auth_authority_id")
    )
    @OnDelete(action = OnDeleteAction.CASCADE) //if shopUser delete, the entity in auth_user_authority will delete without affect the auth_authority table
    private Set<AuthAuthority> authorities;

    @OneToOne(mappedBy = "shopUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Client client;

}
