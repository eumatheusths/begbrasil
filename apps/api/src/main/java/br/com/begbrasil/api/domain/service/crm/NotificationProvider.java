package br.com.begbrasil.api.domain.service.crm;

import br.com.begbrasil.api.domain.model.Quote;

public interface NotificationProvider {
    void notifyCommercialTeam(Quote quote);
}
