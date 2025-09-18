import React from "react";

/**
 * Add your talks here. Use a YouTube video ID when available.
 * Optional: slides, talkUrl (for non-YouTube), location.
 */
export const talks = [
  {
    title: "Digital Discrimination of Users in Sanctioned States: The Case of the Cuba Embargo",
    venue: "USENIX Security Symposium",
    location: "Philadelphia, PA",
    date: "August 15, 2024",
    // If you have a recording on YouTube, set videoId:
    // e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ -> "dQw4w9WgXcQ"
    videoId: "LsCtJx5T1nw", // put your real ID here when available
    // Optionals:
    // slides: "https://example.com/slides.pdf",
    // talkUrl: "https://vimeo.com/… or conference page if no YouTube",
  },
  // Add more items here…
];

const ytThumb = (id) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; // fast, no JS embed

function TalkTile({ t }) {
  const isYouTube = Boolean(t.videoId);
  const href = isYouTube
    ? `https://www.youtube.com/watch?v=${t.videoId}`
    : (t.talkUrl || t.slides || "#");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group block"
      aria-label={`${t.title} — ${t.venue}${t.date ? `, ${t.date}` : ""}`}
    >
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden border border-black/10 bg-white">
        <div className="aspect-video">
          {isYouTube ? (
            <img
              src={ytThumb(t.videoId)}
              alt={`${t.title} thumbnail`}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-sm text-zinc-500">
              No video — opens link
            </div>
          )}
        </div>

        {/* Play badge (only if YouTube) */}
        {isYouTube && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="rounded-full bg-black/60 p-3 transition-all duration-200 group-hover:bg-black/70">
              <svg
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="mt-2">
        <div className="font-medium">{t.title}</div>
        <div className="text-sm text-zinc-600">
          {t.venue}
          {t.location ? <> — {t.location}</> : null}
          {t.date ? `, ${t.date}` : null}
        </div>

        {/* Optional extra links (small) */}
        {(t.slides || (!isYouTube && t.talkUrl)) && (
          <div className="text-sm mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {t.slides && (
              <span
                onClick={(e) => e.stopPropagation()}
                className="underline underline-offset-4"
              >
                <a href={t.slides} target="_blank" rel="noreferrer">Slides</a>
              </span>
            )}
            {!isYouTube && t.talkUrl && (
              <span
                onClick={(e) => e.stopPropagation()}
                className="underline underline-offset-4"
              >
                <a href={t.talkUrl} target="_blank" rel="noreferrer">Talk</a>
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

export default function Talks() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">🎥 Talks</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {talks.map((t, i) => (
          <TalkTile key={i} t={t} />
        ))}
      </div>
    </section>
  );
}