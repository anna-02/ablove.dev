import React from "react";

export const grants = [
  {
    title: "PETS Travel Stipend",
    date: "July 2023",
    details:
      "Granted to attend FOCI ‘23 and the PET Symposium 2023 in Lausanne, Switzerland.",
  },
  {
    title: "USENIX GREPSEC Workshop Travel Grant",
    date: "August 2023",
    details:
      "Granted to attend GREPSEC VI workshop and USENIX ‘23 in Anaheim, California.",
  },
];

export default function Grants() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">✈️ Student Grants & Travel Awards</h2>
      <ul className="space-y-4">
        {grants.map((g, i) => (
          <li key={i} className="leading-relaxed">
            <div className="font-medium">{g.title}</div>
            <div className="text-sm text-zinc-600">
              {g.date ? `${g.date} — ` : null}
              {g.details}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}