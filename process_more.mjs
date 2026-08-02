import fs from 'fs/promises';

async function processMore() {
  const data = JSON.parse(await fs.readFile('crawl_results.json', 'utf-8'));
  
  let problemsMd = '# Relatório de Problemas Encontrados\n\n';
  let redirectsCsv = 'URL antiga,Nova URL sugerida\n';
  let rewriteMd = '# Lista de Conteúdos a Reescrever\n\n';
  let imagesMd = '# Lista de Imagens Necessárias\n\nAs seguintes imagens/produtos foram identificados no site atual, mas muitas não possuem descrição ou são genéricas. É necessário reunir o material fotográfico real:\n\n';
  
  const duplicatesMap = {};
  const titlesMap = {};
  
  for (const page of data) {
    let urlLower = page.url.toLowerCase();
    
    // Redirects Map
    if (urlLower.endsWith('.html')) {
      let slug = page.url.split('/').pop().replace('.html', '');
      redirectsCsv += `${page.url},/produtos/${slug}\n`;
    }
    
    // Problems
    let pageProblems = [];
    if (page.status_code !== 200) pageProblems.push(`- Link quebrado (Status ${page.status_code})`);
    if (!page.meta_desc) pageProblems.push(`- Faltando Meta Description`);
    if (titlesMap[page.title]) pageProblems.push(`- Título duplicado com ${titlesMap[page.title]}`);
    titlesMap[page.title] = page.url;
    
    if (page.text_preview.match(/lorem ipsum|apple ipad mini/i)) {
      pageProblems.push(`- Conteúdo fictício (Lorem Ipsum / Dummy Products)`);
    }
    
    let missingAlt = 0;
    for (const img of page.images) {
      if (!img.alt || img.alt.trim() === '') missingAlt++;
    }
    if (missingAlt > 0) pageProblems.push(`- ${missingAlt} imagens sem descrição (alt tag)`);
    
    if (page.text_preview.match(/patrimônias/i) || page.text_preview.match(/indústriais/i)) {
      pageProblems.push(`- Erro de português detectado`);
    }
    
    if (pageProblems.length > 0) {
      problemsMd += `### ${page.url}\n${pageProblems.join('\n')}\n\n`;
    }
    
    // Content to Rewrite
    if (urlLower.endsWith('.html') || !page.meta_desc || page.text_preview.match(/apple ipad/i)) {
      rewriteMd += `- **${page.url}** (${page.title})\n  - Motivo: Padronização para a nova arquitetura, otimização de SEO, remoção de conteúdo fictício.\n`;
    }
    
    // Needed images
    if (page.images.length > 0 && !urlLower.includes('mini.html') && page.status_code === 200) {
      imagesMd += `### ${page.url} (${page.title})\n`;
      let count = 0;
      for (const img of page.images) {
        if (!img.src.includes('facebook') && !img.src.includes('instagram') && !img.src.includes('whatsapp') && !img.src.includes('flaticon')) {
          imagesMd += `- Substituir/Confirmar: ${img.src} (Alt: ${img.alt || 'sem texto'})\n`;
          count++;
        }
      }
      if (count === 0) imagesMd += `- Nenhuma imagem de produto específica detectada nesta página.\n`;
      imagesMd += '\n';
    }
  }
  
  await fs.writeFile('docs/migration/problems-report.md', problemsMd);
  await fs.writeFile('docs/migration/redirects-map.csv', redirectsCsv);
  await fs.writeFile('docs/migration/needed-images.md', imagesMd);
  await fs.writeFile('docs/migration/content-to-rewrite.md', rewriteMd);
  
  console.log('Finished generating additional reports.');
}

processMore().catch(console.error);
