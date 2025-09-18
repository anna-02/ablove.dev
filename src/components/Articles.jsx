// src/components/Articles.jsx
import React from "react";

export const articles = [
  {
    title: "How Geoblocking Limits Digital Access in Sanctioned States",
    outlet: "Lawfare",
    date: "August 2024", // or exact publish date
    url: "https://www.lawfaremedia.org/article/how-geoblocking-limits-digital-access-in-sanctioned-states",
    description:
      "An examination of how online platforms, wary of sanctions compliance, voluntarily block users in embargoed countries, shrinking the open internet for millions in places like Iran, Syria, and Russia.",
  },
    {
    title: "TSPU: Russia’s Decentralized Censorship System",
    outlet: "Censored Planet",
    date: "November 2022", // or exact publish date
    url: "https://censoredplanet.org/#/tspu",
    description:
    "We measured Russia's new TSPU censorship system, which empowers the Russian government to unilaterally roll out information control measures."
  }
];

export default function Articles() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">
        📝 Research Blogs
      </h2>
      <ul className="space-y-4">
        {articles.map((a, i) => (
          <li key={i}>
            <div className="font-medium">
              <a
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
                class="tlink"
              >
                {a.title}
              </a>
            </div>
            <div className="text-sm text-zinc-600">
              Published in: {a.outlet} — {a.date}
            </div>
            {a.description && (
              <div className="text-sm text-zinc-600 mt-1">{a.description}</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}