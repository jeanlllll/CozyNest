package com.cozynest.repositories;

import com.cozynest.entities.profiles.favorites.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    Favorite findByClient_Id(UUID clientId);
}
