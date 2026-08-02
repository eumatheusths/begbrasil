import fs from 'fs/promises';

async function generate() {
  const oldRedirectsRaw = await fs.readFile('docs/migration/redirects-map.csv', 'utf-8');
  const lines = oldRedirectsRaw.split('\n').filter(l => l.trim().length > 0);
  
  let newCsv = 'URL Antiga,Nova URL Sugerida,Tipo de Redirecionamento (301)\n';
  
  for (let i = 1; i < lines.length; i++) {
    const [oldUrl] = lines[i].split(',');
    if (!oldUrl) continue;
    
    let urlLower = oldUrl.toLowerCase();
    let newUrl = '/produtos/';
    
    if (urlLower.includes('contato')) newUrl = '/contato/';
    else if (urlLower.includes('index') || urlLower === 'https://begbrasil.com.br/') newUrl = '/';
    else if (urlLower.includes('a-beg') || urlLower.includes('sobre')) newUrl = '/sobre/';
    else if (urlLower.includes('termos') || urlLower.includes('normas')) newUrl = '/termos-de-uso/';
    else if (urlLower.includes('privacidade')) newUrl = '/politica-de-privacidade/';
    else if (urlLower.includes('etiqueta') && urlLower.includes('patrimonio')) newUrl = '/produtos/etiquetas-de-patrimonio/';
    else if (urlLower.includes('etiqueta')) newUrl = '/produtos/etiquetas-metalicas/'; // Fallback
    else if (urlLower.includes('placa') && urlLower.includes('maquina')) newUrl = '/produtos/placas-para-maquinas/';
    else if (urlLower.includes('pm') || urlLower.includes('nardini') || urlLower.includes('torno') || urlLower.includes('cabecote')) newUrl = '/produtos/placas-para-maquinas/';
    else if (urlLower.includes('acrilico')) newUrl = '/produtos/adesivos-em-acrilico/';
    else if (urlLower.includes('sinalizacao') || urlLower.includes('seguranca') || urlLower.includes('ps') || urlLower.includes('emergencia')) newUrl = '/produtos/placas-de-sinalizacao/';
    else if (urlLower.includes('adesivo')) newUrl = '/produtos/adesivos-em-acrilico/';
    else if (urlLower.includes('escala') || urlLower.includes('regua')) newUrl = '/produtos/reguas-e-escalas/';
    else if (urlLower.includes('personalizada') || urlLower.includes('pp')) newUrl = '/produtos/placas-personalizadas/';
    else if (urlLower.includes('placa')) newUrl = '/produtos/placas-de-identificacao-industrial/';
    else if (urlLower.includes('orcamento') || urlLower.includes('comprar')) newUrl = '/orcamento/';
    
    // If not categorized, send to main solutions
    if (newUrl === '/produtos/') newUrl = '/solucoes/';
    
    newCsv += `${oldUrl},${newUrl},301\n`;
  }
  
  await fs.writeFile('docs/architecture/routes.csv', newCsv);
  
  // Now write sitemap.md
  const sitemapMd = `# Arquitetura do Site (Sitemap)

## Mapa do Site (Mermaid)

\`\`\`mermaid
graph TD
    A[Home /] --> B[Soluções /solucoes/]
    A --> C[Produtos /produtos/]
    A --> D[Materiais /materiais/]
    A --> E[Segmentos /segmentos/]
    A --> F[Projetos /projetos/]
    A --> G[Conteúdos /conteudos/]
    A --> H[Sobre /sobre/]
    A --> I[Contato /contato/]
    A --> J[Orçamento /orcamento/]

    C --> C1[/produtos/etiquetas-de-patrimonio/]
    C --> C2[/produtos/etiquetas-metalicas/]
    C --> C3[/produtos/placas-para-maquinas/]
    C --> C4[/produtos/placas-de-identificacao-industrial/]
    C --> C5[/produtos/placas-de-sinalizacao/]
    C --> C6[/produtos/placas-personalizadas/]
    C --> C7[/produtos/adesivos-em-acrilico/]
    C --> C8[/produtos/reguas-e-escalas/]

    D --> D1[/materiais/aluminio/]
    D --> D2[/materiais/aco-inox/]
    D --> D3[/materiais/aco/]
    D --> D4[/materiais/acrilico/]
    D --> D5[/materiais/polimeros/]
    D --> D6[/materiais/poliplastic/]

    E --> E1[/segmentos/industrias/]
    E --> E2[/segmentos/fabricantes-de-maquinas/]
    E --> E3[/segmentos/hospitais/]
    E --> E4[/segmentos/escolas-e-universidades/]
    E --> E5[/segmentos/escritorios/]
    E --> E6[/segmentos/manutencao-industrial/]
    E --> E7[/segmentos/setor-publico/]
    E --> E8[/segmentos/condominios/]
    E --> E9[/segmentos/moda-e-acessorios/]
\`\`\`

## Lógica de Navegação

### Critério de 3 Cliques
O usuário consegue chegar a qualquer família de produto em no máximo 3 interações:
1. **Home -> Menu Principal (Hover/Click) -> Categoria Específica** (2 cliques)
2. **Home -> Página Soluções -> Filtro de Categoria -> Produto** (3 cliques)

### Breadcrumbs (Migalhas de Pão)
Todas as páginas internas exibirão breadcrumbs estruturados via Schema.org para auxiliar a navegação do usuário e indexação do Google.
- *Exemplo de Produto:* \`Home > Produtos > Placas para Máquinas\`
- *Exemplo de Material:* \`Home > Materiais > Aço Inox\`

### Navegação Mobile
A arquitetura mobile utilizará um "Hamburger Menu" (Off-canvas) organizado em sistema de "Sanfona" (Accordion):
- Primeiro Nível: Produtos, Materiais, Segmentos, Sobre, Contato.
- Segundo Nível: Expansão direta para as subcategorias sem recarregar a página (Ex: Tocar em "Produtos" desce a lista com Etiquetas de Patrimônio, etc.).
- Um botão "Orçamento" (Call to Action fixo) permanecerá no rodapé do navegador mobile ou no cabeçalho grudado (Sticky Header).

### Links Contextuais (Cross-linking)
Para aumentar o tempo de permanência e facilitar a jornada:
- **Nas páginas de Segmento:** Haverá um bloco "Produtos Indicados para [Segmento]". (Ex: Na página de Hospitais, haverá link direto para Etiquetas de Patrimônio e Placas de Acrílico).
- **Nas páginas de Produtos:** Haverá um bloco "Materiais Disponíveis", linkando para as páginas técnicas (/materiais/aluminio/, etc.).

## Estratégia de Indexação e SEO

### URLs Canônicas
Todas as páginas devem declarar o atributo \`<link rel="canonical" href="https://begbrasil.com.br/caminho-da-pagina" />\` para evitar que o Google interprete variações com parâmetros UTM de campanha (ex: \`?utm_source=fb\`) como conteúdo duplicado.

### Index / Noindex
- **Páginas a indexar (Index, Follow):**
  - / (Home)
  - /solucoes/ e todas as /produtos/*
  - /segmentos/*
  - /materiais/*
  - /projetos/
  - /conteudos/
  - /sobre/ e /contato/
- **Páginas noindex (Noindex, Follow):**
  - /orcamento/ (para evitar indexação da página de transação vazia).
  - /politica-de-privacidade/, /politica-de-cookies/, /termos-de-uso/ (Evitar perda de "crawl budget" do Googlebot em páginas jurídicas irrelevantes para conversão comercial).
  - Páginas de busca interna (ex: /search?q=etiqueta).

*(Nota técnica: Não incluímos especificações técnicas ou promessas irreais nas categorias/materiais, aguardando confirmação prévia da diretoria conforme as regras de negócio mapeadas).*
`;

  await fs.writeFile('docs/architecture/sitemap.md', sitemapMd);
  console.log('Finished generating sitemap and routes.');
}

generate().catch(console.error);
