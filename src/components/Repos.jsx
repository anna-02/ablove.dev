// src/components/Repos.jsx
import React from "react";

const repos=[
        {
      title: "ablove.dev",
      link: "https://github.com/anna-02/ablove.dev",
      image: "/images/ablove-dev-thumb.jpg",
      description: "Personal site built with Vite + React + Tailwind.",
      tag: "website",
    },
    {
      title: "censorship-measure",
      link: "https://github.com/censoredplanet/chinese-llm-blocking",
      image: "/images/repo-censor.jpg",
      description: "Tools for network measurement & geoblocking analysis.",
      tag: "tools",
    }
  ];



export default function Repos() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        Open Repositories
      </h2>

      <ul className="grid gap-6 sm:grid-cols-2">
        {repos.map((r, i) => (
          <li
            key={i}
            className="group overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Thumbnail */}
            <a href={r.link} target="_blank" rel="noreferrer" className="block">
              <div className="relative aspect-video overflow-hidden">
                {r.image ? (
                  <img
                    src={r.image}
                    alt={r.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 grid place-items-center">
                    <span className="text-4xl opacity-70">
                      {r.title?.charAt(0)?.toUpperCase() || "🗂️"}
                    </span>
                  </div>
                )}

                {/* Subtle overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>

            {/* Body */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-800 dark:hover:decoration-zinc-200"
                >
                  {r.title}
                </a>
                {r.tag && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10">
                    {r.tag}
                  </span>
                )}
              </div>

              {r.description && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {r.description}
                </p>
              )}

              <div className="mt-3">
                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:opacity-90"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                  View repo
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}