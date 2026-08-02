package br.com.begbrasil.api.controller;

import br.com.begbrasil.api.domain.model.Quote;
import br.com.begbrasil.api.domain.service.QuoteService;
import br.com.begbrasil.api.dto.QuoteRequest;
import br.com.begbrasil.api.dto.QuoteResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quotes")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping
    public ResponseEntity<QuoteResponse> createQuote(@Valid @RequestBody QuoteRequest request) {
        Quote quote = quoteService.createQuote(request);
        QuoteResponse response = new QuoteResponse(
            quote.getProtocol(), 
            quote.getStatus().name(), 
            "Orçamento recebido com sucesso. Nosso time entrará em contato em breve."
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
