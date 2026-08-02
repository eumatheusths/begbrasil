package br.com.begbrasil.api.domain.service.crm;

import br.com.begbrasil.api.domain.model.Quote;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class DummyNotificationProvider implements NotificationProvider {
    private static final Logger logger = LoggerFactory.getLogger(DummyNotificationProvider.class);

    @Async
    @Override
    public void notifyCommercialTeam(Quote quote) {
        logger.info("[Notification Mock] Equipe comercial notificada sobre o protocolo {} via Email/Slack.", quote.getProtocol());
    }
}
