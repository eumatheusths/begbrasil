package br.com.begbrasil.api.domain.service;

import br.com.begbrasil.api.domain.model.Contact;
import br.com.begbrasil.api.domain.model.Quote;
import br.com.begbrasil.api.domain.repository.ContactRepository;
import br.com.begbrasil.api.domain.repository.QuoteRepository;
import br.com.begbrasil.api.dto.QuoteRequest;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import br.com.begbrasil.api.domain.model.UTMData;
import br.com.begbrasil.api.domain.service.crm.LeadProvider;
import br.com.begbrasil.api.domain.service.crm.NotificationProvider;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final ContactRepository contactRepository;
    private final EmailService emailService;
    private final LeadProvider leadProvider;
    private final NotificationProvider notificationProvider;

    public QuoteService(QuoteRepository quoteRepository, 
                        ContactRepository contactRepository, 
                        EmailService emailService,
                        LeadProvider leadProvider,
                        NotificationProvider notificationProvider) {
        this.quoteRepository = quoteRepository;
        this.contactRepository = contactRepository;
        this.emailService = emailService;
        this.leadProvider = leadProvider;
        this.notificationProvider = notificationProvider;
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

        // Setup UTMs
        if (request.getUtms() != null && !request.getUtms().isEmpty()) {
            UTMData utmData = new UTMData();
            utmData.setUtmSource(request.getUtms().get("utm_source"));
            utmData.setUtmMedium(request.getUtms().get("utm_medium"));
            utmData.setUtmCampaign(request.getUtms().get("utm_campaign"));
            utmData.setUtmTerm(request.getUtms().get("utm_term"));
            utmData.setUtmContent(request.getUtms().get("utm_content"));
            quote.setUtmData(utmData);
        }

        Quote savedQuote = quoteRepository.save(quote);

        // 3. Send Async Email (Atomic DB commit is guaranteed regardless of email success)
        emailService.sendQuoteConfirmation(savedQuote);
        
        // 4. CRM and Commercial Notifications
        leadProvider.sendLead(savedQuote);
        notificationProvider.notifyCommercialTeam(savedQuote);

        return savedQuote;
    }
}
