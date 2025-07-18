package com.cozynest.entities.profiles.favorites;

import com.cozynest.auth.entities.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
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
    @JoinColumn(name="client_id", nullable = false, unique = true)
    private Client client;

    @OneToMany(mappedBy = "favorite", cascade = CascadeType.ALL, orphanRemoval = true, fetch=FetchType.LAZY)
    private List<FavoriteItem> favoriteItems;

}
