import json

with open("/home/claude/toolora/audit_results.json") as f:
    results = json.load(f)

n = len(results)

def pct(key):
    return round(100 * sum(1 for r in results if r[key]) / n, 1)

metrics = {
    "Title Tag Present": pct("has_title"),
    "Title Length Optimal (10-65 chars)": pct("title_ok_len"),
    "Meta Description Present": pct("has_desc"),
    "Meta Description Optimal (50-165 chars)": pct("desc_ok_len"),
    "Canonical Tag Present": pct("has_canonical"),
    "Single H1 Tag": pct("has_single_h1"),
    "H2 Subheadings Present": pct("has_h2"),
    "Viewport Meta (Mobile-friendly)": pct("has_viewport"),
    "Open Graph Title": pct("has_og_title"),
    "Open Graph Description": pct("has_og_desc"),
    "Open Graph Image": pct("has_og_image"),
    "Twitter Card Tag": pct("has_twitter_card"),
    "Structured Data (Schema.org)": pct("has_schema"),
    "Lang Attribute Set": pct("has_lang"),
}

total_imgs = sum(r["img_count"] for r in results)
total_missing_alt = sum(r["img_missing_alt"] for r in results)
img_alt_pct = round(100 * (total_imgs - total_missing_alt) / total_imgs, 1) if total_imgs else 100.0

print(json.dumps(metrics, indent=2))
print("Total images:", total_imgs, "Missing alt:", total_missing_alt, "Alt coverage %:", img_alt_pct)

# pages with issues
no_title = [r["file"] for r in results if not r["has_title"]]
no_desc = [r["file"] for r in results if not r["has_desc"]]
no_canonical = [r["file"] for r in results if not r["has_canonical"]]
multi_h1 = [r["file"] for r in results if r["h1_count"] > 1]
no_h1 = [r["file"] for r in results if r["h1_count"] == 0]
bad_title_len = [(r["file"], r["title_len"]) for r in results if not r["title_ok_len"]]
bad_desc_len = [(r["file"], r["desc_len"]) for r in results if not r["desc_ok_len"]]
no_schema = [r["file"] for r in results if not r["has_schema"]]

print("\nNo title:", no_title)
print("No desc:", no_desc)
print("No canonical:", no_canonical)
print("Multi H1:", multi_h1)
print("No H1:", no_h1)
print("Bad title len:", bad_title_len)
print("Bad desc len:", bad_desc_len[:10], "... total", len(bad_desc_len))
print("No schema count:", len(no_schema))
