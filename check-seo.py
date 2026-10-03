"""Validate indexable pages, catalogue parity and local navigation before deploy."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json, re
import xml.etree.ElementTree as ET

SITE=Path(__file__).resolve().parent
HOST='www.kerstensmediaenpresentatie.nl'; errors=[]
class Page(HTMLParser):
 def __init__(self,s):
  super().__init__();self.tags=[];self.h1=0;self.feed(s)
 def handle_starttag(self,tag,attrs):
  self.tags.append((tag,dict(attrs)))
  if tag=='h1':self.h1+=1
def local(url,base):
 parsed=urlparse(url)
 if parsed.scheme not in ('','http','https') or parsed.netloc not in ('',HOST):return None
 path=unquote(parsed.path)
 target=SITE/path.lstrip('/') if path.startswith('/') else base/path
 return target/'index.html' if target.is_dir() or path.endswith('/') else target

urls=[e.text for e in ET.parse(SITE/'sitemap.xml').iter() if e.tag.endswith('}loc')]
assert len(urls)==len(set(urls)), 'Duplicate sitemap URLs'
for url in urls:
 path=local(url,SITE)
 if not path or not path.exists():errors.append(f'Missing sitemap page {url}');continue
 s=path.read_text(encoding='utf-8');p=Page(s)
 if p.h1!=1:errors.append(f'{path}: {p.h1} h1 headings')
 canonical=[a.get('href') for t,a in p.tags if t=='link' and a.get('rel')=='canonical']
 if canonical!=[url]:errors.append(f'{path}: canonical {canonical} does not match sitemap')
 if not any(t=='meta' and a.get('name')=='description' and a.get('content') for t,a in p.tags):errors.append(f'{path}: description missing')
 if re.search(r'<meta[^>]+content="[^"]*noindex',s):errors.append(f'{path}: noindex in sitemap')
 for raw in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',s,re.S):
  try:json.loads(raw)
  except ValueError:errors.append(f'{path}: invalid structured data')
 base=SITE if any(t=='base' for t,a in p.tags) else path.parent
 for tag,a in p.tags:
  ref=a.get('src') if tag in ('img','script') else a.get('href') if tag in ('a','link') else None
  if not ref or ref.startswith('#'):continue
  dest=local(ref,base)
  if dest and not dest.exists():errors.append(f'{path.relative_to(SITE)}: broken local resource {ref}')
if errors:raise SystemExit('\n'.join(errors))
print(f'PASS: {len(urls)} public pages; canonicals, headings, metadata, structured data, images and navigation.')
