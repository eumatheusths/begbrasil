# BEG Brasil Monorepo

Repositório central do ecossistema BEG Brasil (Arquitetura Astro + Spring Boot).

## Estrutura do Projeto

- `apps/web`: Frontend Institucional (Astro 6, TypeScript, SSR Vercel).
- `apps/api`: Backend Rest API (Spring Boot 3, Java 21, PostgreSQL).
- `content`: Coleções de dados locais para o Astro.
- `infra`: Configurações de banco de dados e containers locais.
- `docs`: Documentações de design, migração e negócios.

## Requisitos

- Node.js v22.12.0 (veja `.nvmrc`)
- Java 21
- Maven
- Docker e Docker Compose (para banco de dados local)

## Como Iniciar Localmente

### 1. Iniciar Banco de Dados (Infra)
O projeto depende de um PostgreSQL local rodando via Docker.
```bash
docker-compose -f infra/docker-compose.yml up -d
```
*(Certifique-se de que a pasta infra tenha o arquivo docker-compose.yml mapeado para a porta 5432).*

### 2. Iniciar API Backend
```bash
cd apps/api
mvn clean install -DskipTests
mvn spring-boot:run
```
A API iniciará na porta `8080`.
Acesse a documentação OpenAPI em: `http://localhost:8080/swagger-ui.html`

### 3. Iniciar Web Frontend
Em outro terminal, na raiz do repositório:
```bash
# Instala as dependências de todos os workspaces
npm install

# Inicia o servidor de desenvolvimento do Astro
npm run dev --workspace=apps/web
```
O Frontend iniciará em `http://localhost:4321`.
Você pode acessar o Design System em `http://localhost:4321/design-system/`.

## Qualidade e Testes

Ambos os projetos possuem pipelines rígidos no GitHub Actions:
- **Web**: Lint (`npm run lint`), Typecheck (`npm run typecheck`), Testes Unitários (Vitest) e E2E (Playwright).
- **API**: Testes de integração (Testcontainers) e padronização (Checkstyle).

Antes de abrir um Pull Request, certifique-se de passar localmente:
```bash
# Web
npm run lint -w apps/web
npm run typecheck -w apps/web

# API
cd apps/api && mvn test
```
