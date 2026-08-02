import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const BASE_URL = 'https://begbrasil.com.br';
const visited = new Set();
const toVisit = [BASE_URL + '/'];
const results = [];

async function crawl() {
  while (toVisit.length > 0) {
    let url = toVisit.shift();
    
    // Remove hash
    let urlObj = new URL(url);
    let cleanUrl = urlObj.origin + urlObj.pathname;
    
    if (visited.has(cleanUrl)) continue;
    visited.add(cleanUrl);
    
    if (!cleanUrl.startsWith(BASE_URL)) continue;
    
    console.log(`Crawling: ${cleanUrl}`);
    
    try {
      const response = await fetch(cleanUrl, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Ch-Ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      if (!response.headers.get('content-type')?.includes('text/html')) {
        console.log(`Skipping non-html: ${cleanUrl} (${response.headers.get('content-type')})`);
        continue;
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const title = $('title').text().trim();
      const h1 = $('h1').text().trim();
      const metaDesc = $('meta[name="description"]').attr('content') || '';
      
      // Look for things requested:
      // errors, fake products, diverged contacts, competitors cited etc.
      // We will save the raw text to analyze later.
      const textPreview = $('body').text().replace(/\s+/g, ' ').trim();
      
      const images = [];
      $('img').each((i, el) => {
        images.push({
          src: $(el).attr('src'),
          alt: $(el).attr('alt') || ''
        });
      });
      
      // Look for duplicate/divergent contacts
      const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const phones = html.match(/\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g) || [];
      
      const pageData = {
        url: cleanUrl,
        title,
        h1,
        meta_desc: metaDesc,
        images,
        emails: [...new Set(emails)],
        phones: [...new Set(phones)],
        text_preview: textPreview.substring(0, 2000), // increased length for better analysis
        status_code: response.status
      };
      
      results.push(pageData);
      
      $('a').each((i, el) => {
        let href = $(el).attr('href');
        if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
          try {
            const nextUrl = new URL(href, cleanUrl);
            const nextCleanUrl = nextUrl.origin + nextUrl.pathname;
            
            // Allow only same domain and ignore standard extensions that are not html
            if (nextCleanUrl.startsWith(BASE_URL)) {
              if (nextCleanUrl.match(/\.(jpg|jpeg|png|gif|pdf|css|js|woff|woff2|ttf|eot|svg|zip|rar)$/i)) return;
              
              if (!visited.has(nextCleanUrl) && !toVisit.includes(nextCleanUrl)) {
                toVisit.push(nextCleanUrl);
              }
            }
          } catch (e) {
            // invalid url
          }
        }
      });
      
      await new Promise(r => setTimeout(r, 100)); // slightly faster
      
    } catch (err) {
      console.error(`Error crawling ${cleanUrl}:`, err.message);
      results.push({
        url: cleanUrl,
        title: `ERROR: ${err.message}`,
        meta_desc: '',
        images: [],
        emails: [],
        phones: [],
        text_preview: '',
        status_code: 0
      });
    }
  }
  
  await fs.writeFile('crawl_results.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Finished crawling. Found ${results.length} pages.`);
}

crawl();
