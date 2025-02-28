package com.cozynest.entities.subscriptions;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscriptions {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime subscriptionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Column(columnDefinition = "TIMESTAMP(0)")
    private LocalDateTime unsubscriptionDate;
}
