package br.com.begbrasil.api.domain.repository;

import br.com.begbrasil.api.domain.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface QuoteRepository extends JpaRepository<Quote, UUID> {
    Optional<Quote> findByProtocol(String protocol);
}
