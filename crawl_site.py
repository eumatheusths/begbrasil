import urllib.request
import urllib.parse
from html.parser import HTMLParser
import time
import ssl
import csv
import json

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.title = ""
        self.in_title = False
        self.meta_desc = ""
        self.in_body = False
        self.text_content = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for attr in attrs:
                if attr[0] == 'href':
                    self.links.append(attr[1])
        elif tag == 'title':
            self.in_title = True
        elif tag == 'meta':
            name = ""
            content = ""
            for attr in attrs:
                if attr[0] == 'name':
                    name = attr[1].lower()
                elif attr[0] == 'content':
                    content = attr[1]
            if name == 'description':
                self.meta_desc = content
        elif tag == 'body':
            self.in_body = True
        elif tag == 'img':
            src = ""
            alt = ""
            for attr in attrs:
                if attr[0] == 'src':
                    src = attr[1]
                elif attr[0] == 'alt':
                    alt = attr[1]
            self.images.append({'src': src, 'alt': alt})

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif tag == 'body':
            self.in_body = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif self.in_body:
            self.text_content.append(data.strip())

def crawl(start_url):
    visited = set()
    to_visit = [start_url]
    base_url = "https://begbrasil.com.br"
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    results = []

    while to_visit:
        url = to_visit.pop(0)
        
        # Remove fragments
        url = urllib.parse.urldefrag(url)[0]
        
        if url in visited:
            continue
            
        if not url.startswith(base_url):
            continue
            
        visited.add(url)
        print(f"Crawling: {url}")
        
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            response = urllib.request.urlopen(req, context=ctx, timeout=10)
            
            # Check content type
            content_type = response.headers.get('Content-Type', '')
            if 'text/html' not in content_type:
                print(f"Skipping non-html: {url}")
                continue
                
            html = response.read().decode('utf-8', errors='ignore')
            
            parser = MyHTMLParser()
            parser.feed(html)
            
            page_data = {
                'url': url,
                'title': parser.title.strip(),
                'meta_desc': parser.meta_desc.strip(),
                'links': [],
                'images': parser.images,
                'text_preview': " ".join([t for t in parser.text_content if t])[:500]
            }
            
            results.append(page_data)
            
            for link in parser.links:
                full_url = urllib.parse.urljoin(url, link)
                if full_url.startswith(base_url) and full_url not in visited and full_url not in to_visit:
                    to_visit.append(full_url)
                    
            time.sleep(1) # delay
            
        except Exception as e:
            print(f"Error crawling {url}: {e}")
            page_data = {
                'url': url,
                'title': f"ERROR: {e}",
                'meta_desc': '',
                'links': [],
                'images': [],
                'text_preview': ''
            }
            results.append(page_data)

    with open('crawl_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    print(f"Crawl finished. Found {len(results)} pages.")

if __name__ == '__main__':
    crawl("https://begbrasil.com.br/")
