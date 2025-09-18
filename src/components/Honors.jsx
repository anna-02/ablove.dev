import React from "react";

export const honors = [
  {
    title: "USENIX ‘24 Distinguished Paper Award",
    date: "August 2024",
    note:
      "For “Digital Discrimination of Users in Sanctioned States: The Case of the Cuba Embargo”.",
  },
];

export default function Honors() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">Research Honors</h2>
      <ul className="space-y-3">
        {honors.map((h, i) => (
          <li key={i} className="leading-relaxed">
            <span className="font-medium">{h.title}</span>
            {h.date ? ` — ${h.date}` : null}
            {h.note ? <div className="text-sm text-zinc-600">{h.note}</div> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}