// src/components/Updates.jsx
import React from "react";

// https://ooni.org/post/2025-gg-omg-village/
export const updates = [
  {
    date: "Aug 2024",
    sortDate: "2024-08-01",
    text: `Digital Discrimination of Users in Sanctioned States: The Case of the Cuba Embargo received a <a href="https://www.usenix.org/conference/usenixsecurity24/presentation/ablove" target="_blank" rel="noreferrer" class="underline underline-offset-4 hover:opacity-80"> Distinguished Paper Award</a> at USENIX 2024!`,
  },
    {
    date: "Nov 2024",
    sortDate: "2024-11-01",
    text: `I co-authored a LawFare article <a href="https://www.lawfaremedia.org/article/how-geoblocking-limits-digital-access-in-sanctioned-states" target="_blank" rel="noreferrer" class="underline underline-offset-4 hover:opacity-80">How Geoblocking Limits Digital Access in Sanctioned States</a>.`,
  },
      {
    date: "Nov 2024",
    sortDate: "2024-11-01",
    text: `I attended  <a href=" https://www.measurementlab.net/blog/open-measurement-gathering-2/" target="_blank" rel="noreferrer" class="underline underline-offset-4 hover:opacity-80">Open Measurement Gathering (OMG) 2 </a>in Atlanta, Georgia as a Censored Planet team member.`,
  },
  {
    date: "Jun 2025",
    sortDate: "2025-06-01",
    text: `I coordinated the <a href="https://www.youtube.com/playlist?list=PLEszjns3sXFGsa42CYPxrQrFPAfA7v71v" target="_blank" rel="noreferrer" class="underline underline-offset-4 hover:opacity-80">OMG 3 virtual event</a>.`,
  },
  {
    date: "Sep 2025",
    sortDate: "2025-09-01",
    text: `Characterizing the Implementation of Censorship Policies in Chinese LLM Services was accepted to NDSS 2026!`,
  },
  {
    date: "Sep 2025",
    sortDate: "2025-09-15",
    text: `I travelled to Estoril, Portal to host a booth at the <a href="https://ooni.org/post/2025-gg-omg-village/" target="_blank" rel="noreferrer" class="underline underline-offset-4 hover:opacity-80">Global Gathering</a> on behalf of Censored Planet, as well as attend OMG 4.`,
  },
    {
    date: "Nov 2025",
    sortDate: "2025-11-10",
    text: `I placed 1st in the <a href="https://cse.engin.umich.edu/stories/outstanding-phd-research-recognized-at-cse-graduate-honors-competition" target="_blank" rel="noreferrer" class="underline underline-offset-4 hover:opacity-80">CSE Graduate Honors Competition</a> with my talk Investigating Emerging Private-Sector Censorship Threats!`,
  }
];

export default function Updates() {
  const sorted = [...updates].sort(
    (a, b) => new Date(b.sortDate) - new Date(a.sortDate)
  );

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">🚀 Updates</h2>
      <div className="space-y-3 pl-2">
        {sorted.map((u, i) => (
          <div key={i} className="flex items-start gap-2 leading-relaxed">
            {/* Date block */}
            <span className="px-2 py-0.5 w-20 text-sm shrink-0">
              {u.date}
            </span>
            {/* Text block */}
            <span
              className="flex-1"
              dangerouslySetInnerHTML={{ __html: u.text }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}