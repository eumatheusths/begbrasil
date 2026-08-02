package br.com.begbrasil.api.domain.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import br.com.begbrasil.api.domain.model.Quote;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void sendQuoteConfirmation(Quote quote) {
        try {
            // Simulação de envio de e-mail (usaríamos JavaMailSender aqui)
            logger.info("Enviando e-mail de confirmação para {} referente ao protocolo {}", 
                quote.getContact().getEmail(), quote.getProtocol());
            
            // Simular delay de rede
            Thread.sleep(1000);
            
            logger.info("E-mail enviado com sucesso.");
        } catch (Exception e) {
            logger.error("Falha ao enviar e-mail para protocolo {}: {}", quote.getProtocol(), e.getMessage());
            // Nota: Esta exceção não fará rollback da transação do banco pois roda em thread @Async
        }
    }
}
