package com.cozynest.repositories;

import com.cozynest.entities.languages.Languages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface LanguageRepository extends JpaRepository<Languages, UUID> {

    Languages findByCode(String code);
}
