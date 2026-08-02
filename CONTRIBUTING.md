# Diretrizes de Contribuição - BEG Brasil

Obrigado pelo interesse em contribuir com a BEG Brasil.
Siga as etapas abaixo para garantir um fluxo organizado e limpo.

## Fluxo de Trabalho (Git Flow Simplificado)

1. Faça o checkout para a branch `main` e atualize-a: `git pull origin main`
2. Crie uma branch para a sua feature ou correção: `git checkout -b feat/nome-da-feature` ou `git checkout -b fix/nome-do-bug`
3. Trabalhe nas suas alterações.
4. Rode os testes e linters localmente antes do commit:
   - Web: `npm run lint -w apps/web` e `npm run typecheck -w apps/web`
   - API: `mvn clean test` dentro de `apps/api`
5. Faça o commit utilizando **Conventional Commits**:
   - `feat: adiciona componente X`
   - `fix: corrige borda do botão Y`
6. Suba a branch: `git push origin feat/nome-da-feature`
7. Abra um Pull Request e aguarde o CI passar e a revisão do time.

## Padrões de Código

- **Frontend:** Obrigatório uso de TypeScript Estrito, propriedades CSS via `global.css` (sem Tailwind), e validação Zod para APIs. Acessibilidade (WCAG AA) é requerida em novos componentes.
- **Backend:** Java 21 com padrão RESTful, cobertura de testes via Testcontainers.
