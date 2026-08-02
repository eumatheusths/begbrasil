package br.com.begbrasil.api.domain.service;

import br.com.begbrasil.api.domain.model.Contact;
import br.com.begbrasil.api.domain.model.Quote;
import br.com.begbrasil.api.domain.repository.ContactRepository;
import br.com.begbrasil.api.domain.repository.QuoteRepository;
import br.com.begbrasil.api.dto.QuoteRequest;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final ContactRepository contactRepository;
    private final EmailService emailService;

    public QuoteService(QuoteRepository quoteRepository, ContactRepository contactRepository, EmailService emailService) {
        this.quoteRepository = quoteRepository;
        this.contactRepository = contactRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Quote createQuote(QuoteRequest request) {
        // 1. Resolve Contact
        Contact contact = contactRepository.findByEmail(request.getEmail())
            .orElseGet(Contact::new);
        
        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setCompany(request.getCompany());
        contact.setWhatsapp(request.getWhatsapp());
        contact.setCity(request.getCity());
        contact.setState(request.getState());
        contact.setIndustry(request.getIndustry());
        contact.setJobTitle(request.getJobTitle());
        
        contact = contactRepository.save(contact);

        // 2. Create Quote
        Quote quote = new Quote();
        quote.setContact(contact);
        quote.setCategory(request.getCategory());
        quote.setMaterial(request.getMaterial());
        quote.setApplicationEnv(request.getApplicationEnv());
        quote.setSurface(request.getSurface());
        quote.setDimensions(request.getDimensions());
        quote.setFormat(request.getFormat());
        quote.setQuantity(request.getQuantity());
        quote.setFixationType(request.getFixationType());
        quote.setHasNumbering(request.getHasNumbering());
        quote.setHasQrcode(request.getHasQrcode());
        quote.setHasBarcode(request.getHasBarcode());
        quote.setColors(request.getColors());
        quote.setDesiredLeadTime(request.getDesiredLeadTime());
        quote.setNotes(request.getNotes());

        Quote savedQuote = quoteRepository.save(quote);

        // 3. Send Async Email (Atomic DB commit is guaranteed regardless of email success)
        emailService.sendQuoteConfirmation(savedQuote);

        return savedQuote;
    }
}
