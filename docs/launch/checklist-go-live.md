# 🚀 Checklist Oficial de Lançamento (Go-Live)

Este documento atesta a passagem da Fase 12 e consolida os testes necessários para mudar o tráfego oficial da BEG Brasil para a nova infraestrutura.

## 🛑 Critérios de Bloqueio (NÃO LANÇAR SE:)
- [ ] O site contiver texto provisório (Lorem Ipsum) em qualquer página.
- [ ] Houver imagens genéricas de bancos de imagens sem aprovação.
- [ ] O e-mail de recebimento de orçamentos ou telefone de WhatsApp estiverem incorretos.
- [ ] Os formulários de orçamento estiverem apontando para `localhost:8080`.
- [ ] Existirem produtos fictícios cadastrados na pasta `/src/content/produtos`.
- [ ] Existirem alegações técnicas não confirmadas pela produção.

## 1. Revisão e Conteúdo
- [ ] Revisão Comercial: Confirmar contatos de WhatsApp, E-mail oficial de faturamento e UTMs.
- [ ] Revisão de Produção/Engenharia: Confirmar descrições e limitações dos materiais (Alumínio, Inox, Acrílico).
- [ ] Revisão Jurídica: Validar se os Termos e Políticas (LGPD) e o banner de Cookies estão condizentes com a empresa.
- [ ] Preencher e confirmar todas as tags `<title>` e `<meta name="description">` dos produtos usando a planilha `content-inventory.csv`.

## 2. Infraestrutura e Deployment
- [ ] **Front-end (Vercel)**:
  - Adicionar o domínio `begbrasil.com.br` no painel da Vercel.
  - Apontar os nameservers (ou registros A/CNAME) no Registro.br ou Cloudflare.
  - Configurar variável de ambiente `PUBLIC_API_URL` com a URL real do Back-end.
- [ ] **Back-end (Spring Boot)**:
  - Subir a API (AWS Elastic Beanstalk / Render / Railway).
  - Configurar banco de dados de produção (PostgreSQL) e injetar senhas (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
  - Configurar o SMTP oficial do e-mail da BEG (`SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`).
  - Restringir a porta `8081` (Actuator Healthcheck) apenas para leitura da rede interna.

## 3. SEO e Redirects
- [ ] Validar se as URLs listadas em `docs/migration/redirects.csv` estão de fato fazendo o bypass (301) na Vercel para a nova rota.
- [ ] Confirmar a existência de `sitemap-index.xml` após o build do front-end.
- [ ] Ir ao **Google Search Console**, submeter o novo `sitemap-index.xml`.
- [ ] Solicitar indexação forçada da Homepage.

## 4. Testes Finais de Qualidade
- [ ] **Mobile:** Testar no iPhone Safari e Android Chrome (Header de hambúrguer, tabelas comparativas deslizando).
- [ ] **Lighthouse:** Validar no ambiente de Homologação se as métricas de Performance LCP (<= 2.5s) e CLS (<= 0.1) estão garantidas.
- [ ] **Acessibilidade:** Confirmar se é possível navegar pelo formulário em passos (Stepper) utilizando apenas a tecla `TAB`.

> [!TIP]
> Após o lançamento, monitore os logs da API nos primeiros 3 dias úteis para garantir que o envio de orçamentos e anexos PDF estão operando na escala real da fábrica sem problemas de limite de tamanho de pacote (Max-Upload).
