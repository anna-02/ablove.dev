// src/components/Service.jsx
import React from "react";

export const serviceItems = [
{
    sentence:
      "Graduate Student Coordinator for Explore Computer Science Research Program 2025-2026.",
  },
  {
    sentence:
      "Manager of Tor relay hosted at the University of Michigan.",
  },
  {
    sentence:
      "Member of Program Committee for Free and Open Communications on the Internet (FOCI) 2026, co-located with PETS 2026.",
  },

];

export default function Service() {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">🌍 Service</h2>
<ul className="list-disc list-outside space-y-3 text-[1.02rem] pl-6">
  {serviceItems.map((s, i) => (
    <li key={i} className="leading-relaxed">
      {s.sentence}
    </li>
  ))}
</ul>
    </section>
  );
}