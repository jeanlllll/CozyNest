package com.cozynest.entities.profiles.favorites;

import com.cozynest.auth.entities.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name="favorite")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JoinColumn(name="client_userId")
    private Client client;

    @OneToMany(mappedBy = "favorite")
    private List<FavoriteItem> favoriteItems;

}
