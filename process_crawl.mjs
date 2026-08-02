import fs from 'fs/promises';
import { stringify } from 'csv-stringify/sync';

async function processData() {
  const data = JSON.parse(await fs.readFile('crawl_results.json', 'utf-8'));
  
  const inventory = [];
  const issues = [];
  const facts = new Set();
  
  const titles = {};
  const contents = {};
  
  const emails = new Set();
  const phones = new Set();
  
  for (const page of data) {
    if (page.status_code !== 200) {
      issues.push(`Broken Link or Error: ${page.url} (${page.status_code})`);
      inventory.push({
        url: page.url, tipo: 'erro', titulo: page.title, status: page.status_code,
        manter: '', reescrever: '', remover: 'sim', nova_url: '', redirecionamento: '', observacoes: 'Erro ' + page.status_code
      });
      continue;
    }
    
    // Check duplicates
    if (titles[page.title]) {
      issues.push(`Duplicate Title: "${page.title}" found in ${page.url} and ${titles[page.title]}`);
    } else {
      titles[page.title] = page.url;
    }
    
    // Very simple content duplication check (based on text preview hash/length)
    const textHash = page.text_preview.length > 100 ? page.text_preview.substring(0, 100) : page.url;
    if (contents[textHash] && page.text_preview.length > 100) {
      issues.push(`Potential Duplicate Content: ${page.url} and ${contents[textHash]}`);
    } else {
      contents[textHash] = page.url;
    }
    
    // Missing desc
    if (!page.meta_desc || page.meta_desc.trim() === '') {
      issues.push(`Missing Meta Description: ${page.url}`);
    }
    
    // Fake products / text
    if (page.text_preview.match(/lorem ipsum|apple ipad mini/i)) {
      issues.push(`Fake Products or Dummy Text: ${page.url}`);
    }
    
    // Images without alt
    let missingAltCount = 0;
    for (const img of page.images) {
      if (!img.alt || img.alt.trim() === '') missingAltCount++;
    }
    if (missingAltCount > 0) {
      issues.push(`Images missing alt text: ${page.url} (${missingAltCount} images)`);
    }
    
    // Portuguese errors (basic heuristics)
    if (page.text_preview.match(/patrimônias/i) || page.text_preview.match(/indústriais/i)) {
      issues.push(`Potential Portuguese Error: ${page.url} (e.g. Patrimônias/Indústriais)`);
    }
    
    // Collect contacts
    page.emails.forEach(e => emails.add(e));
    page.phones.forEach(p => phones.add(p));
    
    // Categorize
    let tipo = 'desconhecido';
    let urlLower = page.url.toLowerCase();
    
    if (urlLower === 'https://begbrasil.com.br/' || urlLower.endsWith('index.html')) tipo = 'institucional';
    else if (urlLower.includes('contato') || urlLower.includes('local')) tipo = 'contato';
    else if (urlLower.includes('sobre-nos') || urlLower.includes('a-beg')) tipo = 'institucional';
    else if (urlLower.includes('termos') || urlLower.includes('privacidade') || urlLower.includes('normas') || urlLower.includes('envio') || urlLower.includes('pagamento') || urlLower.includes('prazo') || urlLower.includes('cuidado') || urlLower.includes('insta')) tipo = 'politicas';
    else if (urlLower.includes('blog')) tipo = 'artigos';
    else if (urlLower.endsWith('.html') && (urlLower.includes('beg-brasil') || urlLower.includes('placa') || urlLower.includes('etiqueta') || urlLower.includes('adesivo') || urlLower.match(/[0-9]+/))) tipo = 'produto';
    else if (urlLower.endsWith('.html')) tipo = 'página antiga .html';
    else tipo = 'página';
    
    let remover = '';
    let reescrever = '';
    let manter = '';
    let obs = [];
    
    if (urlLower.includes('mini.html') || page.text_preview.match(/apple ipad mini/i)) {
      remover = 'sim';
      obs.push('Produto fictício/Dummy');
    } else if (tipo === 'página antiga .html' || urlLower.endsWith('.html')) {
      reescrever = 'sim';
      manter = 'sim';
      obs.push('Migrar para nova arquitetura');
    } else {
      manter = 'sim';
    }
    
    inventory.push({
      'URL atual': page.url,
      'tipo': tipo,
      'título': page.title,
      'status': page.status_code,
      'manter': manter,
      'reescrever': reescrever,
      'remover': remover,
      'nova URL': '',
      'redirecionamento': '',
      'observações': obs.join(', ')
    });
  }
  
  // CSV Output
  const csvStr = stringify(inventory, { header: true });
  await fs.writeFile('docs/migration/content-inventory.csv', csvStr);
  
  // Issues & Facts
  const factsMd = `# Fatos a Confirmar - BEG Brasil

A diretoria precisa confirmar as seguintes informações para a nova versão do site:

## Empresa
- **Ano de fundação:** [ ] Qual o ano oficial de fundação da empresa?
- **Endereço:** [ ] (O site lista um mapa mas precisamos do endereço completo oficial para o rodapé e contato).
- **Contatos Divergentes:** Foram encontrados múltiplos e-mails e telefones. Quais são os oficiais?
  - E-mails encontrados: ${Array.from(emails).join(', ')}
  - Telefones encontrados: ${Array.from(phones).join(', ')}
- **Nomes dos vendedores:** [ ] Confirmar os nomes da equipe de vendas para humanizar o contato (se aplicável).

## Produtos & Produção
- **Materiais utilizados:** [ ] Alumínio, Poliéster, BOPP, Vinil, Aço Inox, Acrílico, PVC. (Confirmar a lista completa).
- **Processos de fabricação:** [ ] Quais processos exatos devem ser destacados (ex: gravação, impressão, resinagem)?
- **Quantidade mínima:** [ ] Qual o pedido mínimo (MOQ) para cada categoria de produto?
- **Segmentos atendidos:** [ ] (Indústria, Logística, Comércio, etc.).
- **Garantias:** [ ] Qual o tempo de garantia oferecido nos produtos contra desgaste?
- **Certificações:** [ ] A empresa possui ISO ou outras certificações de qualidade?

## Políticas
- **Prazos:** [ ] Qual o prazo padrão de desenvolvimento/produção? E o prazo de entrega?
- **Política de Envio:** [ ] Transportadoras parceiras, Correios, regiões atendidas (todo Brasil confirmado, mas há restrições?).
- **Política de Aprovação da Arte:** [ ] Como funciona o envio do layout (desenho) e número de alterações permitidas?
- **Política de Pagamento:** [ ] Quais as formas de pagamento aceitas (Boleto, Pix, Cartão) e condições de faturamento?

---

## Relatório Preliminar de Problemas Encontrados (Para Referência)
${issues.map(i => '- ' + i).join('\n')}
`;
  
  await fs.writeFile('docs/migration/facts-to-confirm.md', factsMd);
  console.log('Processed! Generated CSV and MD.');
}

processData().catch(console.error);
