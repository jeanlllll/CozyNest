package com.cozynest.auth.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name="admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    private UUID id;

    private String position;

    private String department;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="shop_user_id")
    @MapsId
    private ShopUser user;

}
