package br.com.begbrasil.api.domain.repository;

import br.com.begbrasil.api.domain.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    Optional<Contact> findByEmail(String email);
}
