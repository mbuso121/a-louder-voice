import { useEffect } from "react";

/**
 * SEO component — updates document <head> for each page.
 * Google indexes React SPAs, but giving each page a unique
 * title + description significantly improves ranking.
 */
export default function SEO({ title, description, path = "", image }) {
  const siteName = "A Louder Voice";
  const baseUrl  = "https://aloudervoice.co.za";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Stories, Letters & Community`;
  const fullUrl   = `${baseUrl}${path}`;
  const ogImage   = image || `${baseUrl}/og-image.jpg`;
  const fullDesc  = description || "A South African platform for raw storytelling, unsent letters, SMME stories and community engagement.";

  useEffect(() => {
    // Title
    document.title = fullTitle;

    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("[name") ? "name" : "property";
        const val  = selector.match(/["']([^"']+)["']/)?.[1];
        if (attr && val) el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]',           fullDesc);
    setMeta('meta[property="og:title"]',          fullTitle);
    setMeta('meta[property="og:description"]',    fullDesc);
    setMeta('meta[property="og:url"]',            fullUrl);
    setMeta('meta[property="og:image"]',          ogImage);
    setMeta('meta[name="twitter:title"]',         fullTitle);
    setMeta('meta[name="twitter:description"]',   fullDesc);
    setMeta('meta[name="twitter:image"]',         ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

  }, [fullTitle, fullDesc, fullUrl, ogImage]);

  return null;
}

/**
 * ArticleSchema — add to individual post pages for Google rich results
 * (shows author, date, thumbnail in search results)
 */
export function ArticleSchema({ post, url }) {
  const baseUrl = "https://aloudervoice.co.za";

  useEffect(() => {
    if (!post) return;

    const existing = document.getElementById("article-schema");
    if (existing) existing.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": post.category === "smme" ? "Article" : "BlogPosting",
      "headline": post.title || "A Louder Voice Post",
      "description": post.content ? post.content.slice(0, 200) : "",
      "url": `${baseUrl}${url}`,
      "datePublished": post.createdAt,
      "dateModified":  post.updatedAt || post.createdAt,
      "author": {
        "@type": "Person",
        "name": post.is_anonymous ? "Anonymous" : (post.author_name || post.author || "A Louder Voice")
      },
      "publisher": {
        "@type": "Organization",
        "name": "A Louder Voice",
        "url": baseUrl,
        "sameAs": [
          "https://www.instagram.com/a_louder_voice",
          "https://www.tiktok.com/@a_louder_voice"
        ]
      },
      ...(post.image ? { "image": post.image } : {})
    };

    const script = document.createElement("script");
    script.id = "article-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("article-schema");
      if (el) el.remove();
    };
  }, [post, url]);

  return null;
}
