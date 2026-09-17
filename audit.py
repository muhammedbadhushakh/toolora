import os, re, json
from bs4 import BeautifulSoup

root = "/home/claude/toolora"
html_files = []
for dirpath, dirs, files in os.walk(root):
    for f in files:
        if f.endswith(".html"):
            html_files.append(os.path.join(dirpath, f))

print(f"Total HTML files: {len(html_files)}")

results = []
for fp in html_files:
    with open(fp, encoding="utf-8", errors="ignore") as fh:
        content = fh.read()
    soup = BeautifulSoup(content, "lxml")
    rel = os.path.relpath(fp, root)

    title = soup.find("title")
    title_text = title.text.strip() if title else ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    desc_text = meta_desc["content"].strip() if meta_desc and meta_desc.get("content") else ""
    canonical = soup.find("link", attrs={"rel": "canonical"})
    h1s = soup.find_all("h1")
    viewport = soup.find("meta", attrs={"name": "viewport"})
    og_title = soup.find("meta", property="og:title")
    og_desc = soup.find("meta", property="og:description")
    og_image = soup.find("meta", property="og:image")
    twitter_card = soup.find("meta", attrs={"name": "twitter:card"})
    robots_meta = soup.find("meta", attrs={"name": "robots"})
    schema = soup.find_all("script", attrs={"type": "application/ld+json"})
    imgs = soup.find_all("img")
    imgs_no_alt = [i for i in imgs if not i.get("alt", "").strip()]
    lang = soup.find("html")
    lang_attr = lang.get("lang") if lang else None
    h2s = soup.find_all("h2")
    internal_links = soup.find_all("a", href=True)

    results.append({
        "file": rel,
        "title": title_text,
        "title_len": len(title_text),
        "has_title": bool(title_text),
        "title_ok_len": 10 <= len(title_text) <= 65,
        "desc": desc_text,
        "desc_len": len(desc_text),
        "has_desc": bool(desc_text),
        "desc_ok_len": 50 <= len(desc_text) <= 165,
        "has_canonical": bool(canonical),
        "h1_count": len(h1s),
        "has_single_h1": len(h1s) == 1,
        "has_h2": len(h2s) > 0,
        "has_viewport": bool(viewport),
        "has_og_title": bool(og_title),
        "has_og_desc": bool(og_desc),
        "has_og_image": bool(og_image),
        "has_twitter_card": bool(twitter_card),
        "has_schema": len(schema) > 0,
        "img_count": len(imgs),
        "img_missing_alt": len(imgs_no_alt),
        "has_lang": bool(lang_attr),
        "internal_link_count": len(internal_links),
    })

with open("/home/claude/toolora/audit_results.json", "w") as f:
    json.dump(results, f, indent=2)

print("Done, sample:")
print(json.dumps(results[0], indent=2))
