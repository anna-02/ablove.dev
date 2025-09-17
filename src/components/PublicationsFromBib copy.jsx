// src/components/PublicationsFromBib.jsx
import React, { useEffect, useState } from "react";
import Cite from "citation-js";

/** Pull year from a CSL item (Citation.js output) */
const yearOf = (item) => item?.issued?.["date-parts"]?.[0]?.[0] ?? 0;

/** Very small BibTeX field extractor for custom fields (per entry) */
function extractExtrasFromBib(bibText) {
  // Build map: key -> { talk, slides, video, code, poster, pdf, website }
  const map = {};
  // Split entries optimistically (handles most common BibTeX)
  const entries = bibText.split(/(?=@[a-zA-Z]+\s*\{)/g).filter(Boolean);

  for (const raw of entries) {
    // capture key between @type{KEY,
    const keyMatch = raw.match(/^@\w+\s*\{\s*([^,\s]+)\s*,/s);
    if (!keyMatch) continue;
    const key = keyMatch[1].trim();

    // Helper to find field= {value} or "value"
    const grab = (field) => {
      const r = new RegExp(
        `${field}\\s*=\\s*(\\{([^}]*)\\}|\\"([^"]*)\\")`,
        "i"
      );
      const m = raw.match(r);
      return m ? (m[2] ?? m[3] ?? "").trim() : "";
    };

    const extras = {
      talk: grab("talk"),
      slides: grab("slides"),
      video: grab("video"),
      code: grab("code"),
      poster: grab("poster"),
      pdf: grab("pdf"),
      website: grab("website"),
    };

    // Normalize empties to undefined
    for (const k of Object.keys(extras)) if (!extras[k]) delete extras[k];

    if (Object.keys(extras).length) map[key] = extras;
  }
  return map;
}

/** Build the links bar in the preferred order, showing only what's available */
function LinksBar({ item }) {
  const links = [];

  // Prefer explicit pdf field; else use URL if it looks like a PDF
  const pdf =
    item.pdf ||
    (item.URL && typeof item.URL === "string" && item.URL.toLowerCase().endsWith(".pdf")
      ? item.URL
      : undefined);

  if (pdf) links.push(["PDF", pdf]);
  if (item.talk) links.push(["Talk", item.talk]);
  if (item.slides) links.push(["Slides", item.slides]);
  if (item.video) links.push(["Video", item.video]);
  if (item.code) links.push(["Code", item.code]);
  if (item.poster) links.push(["Poster", item.poster]);
  if (item.DOI) links.push(["DOI", `https://doi.org/${item.DOI}`]);
  if (item.website) links.push(["Website", item.website]);
  if (item.artifact) links.push(["Artifact", item.artifact]);
  // If none above, but we still have a generic URL, surface it as Link
  if (!links.length && item.URL) links.push(["Link", item.URL]);

  if (!links.length) return null;

  return (
    <div className="text-base mt-1 flex flex-wrap gap-x-4 gap-y-1">
      {links.map(([label, href], i) => (
        <a
          key={`${label}-${i}`}
          className="underline text-base underline-offset-4"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>
        
      ))
      
      }
    </div>
  );
}

export default function PublicationsFromBib() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // 1) Load raw .bib
        const bibText = await (await fetch("/publications.bib")).text();

        // 2) Parse to CSL-JSON (standardized structure)
        const cite = new Cite(bibText);
        const csl = cite.format("data", { format: "object" });

        // 3) Pull custom fields from raw .bib and merge by key
        const extrasMap = extractExtrasFromBib(bibText);
        const merged = csl.map((p) => {
          // Citation.js typically keeps the BibTeX key in p.id
          const key = p.id || "";
          return { ...p, ...(extrasMap[key] || {}) };
        });

        // 4) Sort newest → oldest (flat list)
        merged.sort((a, b) => yearOf(b) - yearOf(a));

        setItems(merged);
      } catch (e) {
        setErr(String(e));
      }
    })();
  }, []);

  if (err) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">📖 Publications</h2>
        <p className="text-sm text-red-600">
          Failed to load publications: {err}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">Publications</h2>
      <ul className="space-y-6">
        {items.map((p) => {
        const authors = p.author
            ?.map((a) => {
            const full = [a.given, a.family].filter(Boolean).join(" ");
            return full === "Anna Ablove" || full === "Anna Ablove*" ? <strong key={full}>{full}</strong> : full;
            })
            .reduce((acc, cur, i) => {
            // insert separators with commas
            if (i > 0) acc.push(", ");
            acc.push(cur);
            return acc;
            }, []);
          const venue = p["container-title"];
          const year = yearOf(p) || "";

          return (
            <li key={p.id || `${p.title}-${year}`}>
                {/*EDITING THE NAME*/}
                <div className="text-lg font-bold">
                    {p.pdf ? (
                    <a class="tlink"
                        href={p.pdf.startsWith("http") ? p.pdf : `/${p.pdf}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4"
                    >
                        {p.title}
                    </a>
                    ) : (
                    p.title
                    )}
                </div>
              <div className="text-lg text-zinc-600">
                {authors}
                {venue ? (
                  <>
                    {" "}
                    — <em>{venue}</em>
                  </>
                ) : null}
                {year ? `, ${year}` : null}
              </div>

              {/* PDF | Talk | Slides | Video | Code | Poster | DOI | Website */}
              <LinksBar item={p} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}