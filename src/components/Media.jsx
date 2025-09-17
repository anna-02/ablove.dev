import React from "react";

export const mediaItems = [
  {
    title: "CSE authors receive Distinguished Paper Award at USENIX Security for research on geoblocking",
    platform: "University of Michigan CSE",
    date: "August 2024",
    url: "https://cse.engin.umich.edu/stories/cse-authors-receive-distinguished-paper-award-at-usenix-security-for-research-on-geoblocking",
  },
  // add more items here: https://www.measurementlab.net/blog/open-measurement-gathering-1/
  {
    title: "Ten papers by CSE researchers at USENIX Security 2024",
    platform: "University of Michigan CSE",
    date: "August 2024",
    url: "https://cse.engin.umich.edu/stories/ten-papers-by-cse-researchers-at-usenix-security-2024",
  },
//     {
//     title: "M-Lab Organizes and Participates in the First Open Measurement Gathering (OMG)",
//     platform: "M-Lab",
//     date: "August 2024",
//     url: "https://www.measurementlab.net/blog/open-measurement-gathering-1/",
//   },
];

export default function Media() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">
        📣 In the News 
      </h2>
      <ul className="space-y-4">
        {mediaItems.map((m, i) => (
          <li key={i}>
            <div className="font-medium">
              <a
                href={m.url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
                class="tlink"
              >
                {m.title}
              </a>
            </div>
            <div className="text-sm text-zinc-600">
              {m.platform} — {m.date}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}