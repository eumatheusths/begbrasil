package br.com.begbrasil.api.domain.service.crm;

import br.com.begbrasil.api.domain.model.Quote;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class DummyLeadProvider implements LeadProvider {
    private static final Logger logger = LoggerFactory.getLogger(DummyLeadProvider.class);

    @Async
    @Override
    public void sendLead(Quote quote) {
        logger.info("[CRM Mock] Lead registrado com sucesso no Hubspot/RD Station. Protocolo: {}, Origem UTM: {}", 
            quote.getProtocol(), 
            quote.getUtmData() != null ? quote.getUtmData().getUtmSource() : "N/A");
    }
}
