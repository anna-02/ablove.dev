import React, { useEffect, useState } from "react";
import Cite from "citation-js";

const yearOf = (item) => item?.issued?.["date-parts"]?.[0]?.[0] ?? 0;
const localfields = ["talk=", "slides=", "pdf="];
const lfields = "talk= slides= pdf="

const EXCLUDE_FIELDS = ["slides", "talk", "pdf"];

function stripFields(raw) {
  const EX = new Set(EXCLUDE_FIELDS.map(f => f.toLowerCase()));
  return raw
    .split("\n")
    .filter(line => {
      const m = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*=/);
      return !m || !EX.has(m[1].toLowerCase());
    })
    .join("\n");
}


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
      artifact: grab("artifacat"),
      poster: grab("poster"),
      pdf: grab("pdf"),
      website: grab("website"),
      raw: raw
    };

    // Normalize empties to undefined
    for (const k of Object.keys(extras)) if (!extras[k]) delete extras[k];

    if (Object.keys(extras).length) map[key] = extras;
  }
  return map;
}


function formatBibtex(raw) {
  return raw
    .split("\n")
    .map((line) => {
      const eq = line.indexOf("=");
      if (eq === -1) return line;
      const keyPart = line.slice(0, eq + 1);
      const valuePart = line.slice(eq + 1).trimStart();
      const indent = " ".repeat(keyPart.length + 1);
      return keyPart + " " + valuePart.replace(/\n/g, "\n" + indent);
    })
    .join("\n");
}

function LinksBar({ item }) {
    console.log(item);
  const links = [];
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
      ))}
    </div>
  );
}

export default function PublicationsFromBib() {
  const [items, setItems] = useState([]);
  const [bibMap, setBibMap] = useState({});
  const [openBib, setOpenBib] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const bibText = await (await fetch("/publications.bib")).text();

        const cite = new Cite(bibText);
        const csl = cite.format("data", { format: "object" });

        const extrasMap = extractExtrasFromBib(bibText);
        const merged = csl.map((p) => {
          const key = p.id || "";
          return { ...p, ...(extrasMap[key] || {}) };
        });

        merged.sort((a, b) => yearOf(b) - yearOf(a));

        setItems(merged);
        setBibMap(extrasMap);
      } catch (e) {
        setErr(String(e));
      }
    })();
  }, []);

  if (err) {
    return (
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">📖 Publications</h2>
        <p className="text-sm text-red-600">Failed to load publications: {err}</p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">
        Publications
      </h2>
      <ul className="space-y-6">
        {items.map((p) => {
          const authors = p.author
            ?.map((a) => {
              const full = [a.given, a.family].filter(Boolean).join(" ");
              if (full ==="Anna Ablove" || full === "Anna Ablove*") return <strong key={full}>{full}</strong>;
              return full;
            //   return (full === "Anna Ablove" || "Anna Ablove*") ? <strong key={full}>{full}</strong> : full;
            })
            .reduce((acc, cur, i) => {
              if (i > 0) acc.push(", ");
              acc.push(cur);
              return acc;
            }, []);

          const venue = p["container-title"];
          const year = yearOf(p) || "";
          const pdf = p.pdf;

          return (
            <li key={p.id || `${p.title}-${year}`}>
              <div className="text-md font-bold flex items-center gap-3">
                {pdf ? (
                  <a
                    href={pdf.startsWith("http") ? pdf : `/${pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                    class="tlink"
                  >
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
                {/* BibTeX button */}
                <button
                  onClick={() => setOpenBib(openBib === p.id ? null : p.id)}
                  className="text-sm px-2 py-1 border border-zinc-400 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  BibTeX
                </button>

              </div>

              <div className="text-md text-zinc-600">
                {authors}
                {venue ? <> — <em>{venue}</em></> : null}
                {year ? `, ${year}` : null}
              </div>

              <LinksBar item={p} />

              {/* Collapsible BibTeX */}

              {openBib === p.id && (
                <pre className="mt-2 p-2 bg-zinc-100 dark:bg-zinc-900 text-sm text-white overflow-x-auto whitespace-pre-wrap break-words rounded">
                  {/* {bibMap[p.id]?.raw || "No BibTeX found"} */}
                    {stripFields(bibMap[openBib]?.raw || "")}
                </pre>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}