// src/App.jsx

import React from 'react'
import { Mail, Github, Linkedin, FileText } from "lucide-react";

// in App.jsx
import Publications from "./components/PublicationsFromBib";
import Service from "./components/Service";
import Talks from "./components/Talks";
import Honors from "./components/Honors";
import Grants from "./components/Grants";
import Articles from "./components/Articles";
import Media from "./components/Media";
import Repos from "./components/Repos";



const PROFILE = {
  name: "Anna Ablove",
  tagline: "CS PhD @ University of Michigan",
  location: "Ann Arbor, MI",
  emailText: "aablove[@]umich[.]edu",
  emailHref: "mailto:aablove@umich.edu",
  website: "https://www.ablove.dev",
  github: "https://github.com/anna-02",
  linkedin: "https://www.linkedin.com/in/annaablove/",
  cv: "/cv.pdf",
  headshot: "/images/profile3.jpeg",
}

const A = ({ href, children }) => (
  <a
    className="underline underline-offset-4 hover:opacity-80"
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel="noreferrer"
  >
    {children}
  </a>
)
const Li = ({ children }) => <li className="leading-relaxed">{children}</li>

export default function App() {
  return (
 <main className="min-h-screen font-serif-stack">
   <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {/* Mobile header with horizontal padding */}
        <header className="lg:hidden flex items-center gap-4 mb-8">
          {/* <img
            src={PROFILE.headshot}
            alt="Anna Ablove headshot :)"
            className="w-40 h-40 object-cover border border-black/10 rounded-full"
          /> */}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{PROFILE.name}</h1>
            <p className="mt-1 text-lg">{PROFILE.tagline}</p>
          </div>
        </header>

        {/* Grid layout on md+; using ps-* for left gutter */}
        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] items-start gap-8 md:gap-12">
          {/* Sidebar always on left, with gutter from ps-* \./ps-6 md:ps-10 */}
          
            <aside className="hidden lg:block fixed sticky top-16 left-0 self-start h-fit">
            <img
                src={PROFILE.headshot}
                alt="Anna Ablove headshot"
                className="w-[200px] h-[200px] object-cover border border-black/10 rounded-full double-border"
            />
            <div className="mt-4 space-y-2 text-lg text-zinc-600 leading-relaxed">
                <div className="font-semibold text-xl text-black">{PROFILE.name}</div>
                <div className="italic font-light tracking-wide">{PROFILE.tagline}</div>
                {/*<span className="font-medium uppercase text-xs tracking-widest">Email:</span> */}
            <ul className="space-y-2 text-base">
                <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-500" />
                <A href={PROFILE.emailHref}>{PROFILE.emailText}</A>
                </li>
                <li className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-zinc-500" />
                <A href={PROFILE.linkedin}>LinkedIn</A>
                </li>
                <li className="flex items-center gap-2">
                <Github className="w-4 h-4 text-zinc-500" />
                <A href={PROFILE.github}>GitHub</A>
                </li>
                <li className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <A href={PROFILE.cv}>CV</A>
                </li>
            </ul>
            </div>
            </aside>

          {/* Content column—not full width, capped */}
          <section className="min-w-0 md:max-w-4xl pr-6 justify-self-start ">
            {/* Title for md+ to align with sidebar top */}
            {/* <div className="hidden md:block mb-6">
              <h1 className="text-3xl font-semibold tracking-tight">{PROFILE.name}</h1>
              <p className="mt-1 text-lg">{PROFILE.tagline}</p>
            </div> */}

            <section>
              <h2 className="text-2xl font-semibold mb-3 pb-2 border-b border-zinc-300 dark:border-zinc-300">About</h2>
              <p className="leading-relaxed text-[1rem]">
                My name is Anna Ablove, and I am a Computer Science PhD candidate at the <a class="tlink" href="https://cse.engin.umich.edu/">University of Michigan</a>, 
                studying under <a class="tlink" href="https://censoredplanet.org/team">Prof. Roya Ensafi</a>. My research centers on network security and Internet freedom, particularly 
                at the intersection of computer science, policy, and human rights. Generally, I focus on topics such as network 
                measurement, censorship/geoblocking, and the integration of user perspectives. More recently, 
                I’ve been interested in how big tech can aid Internet accessibility and transparency.              </p>
            </section>

            <Publications />
            <Articles/>
            <Media/>
            {/* <Repos /> */}
            <Service />
            <Grants />
            <Honors />
            <Talks />


            {/* <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-3">Research & Papers</h2>
              <div className="space-y-6">
                <article>
                  <h3 className="text-lg font-medium">Digital Discrimination of Users in Sanctioned States: The Case of the Cuba Embargo</h3>
                  <p className="text-lg mt-1">A. Ablove; S. Chandrashekaran; H. Le; R. Sundara Raman; R. Ramesh; H. Oppenheimer; R. Ensafi — USENIX Security 2024</p>
                  <p className="text-lg mt-2"><A href="https://www.usenix.org/system/files/sec24summer-prepub-ablove.pdf">PDF</A></p>
                </article>
                <article>
                  <h3 className="text-lg font-medium">Overt Filtering in Chinese LLM Services (working title)</h3>
                  <p className="text-lg mt-1">A. Ablove et al. — NDSS (target), 2026</p>
                </article>
              </div>
            </section> */}

            <footer className="mt-12 pt-6 border-t border-black/10 text-sm">
              <p>© {new Date().getFullYear()} {PROFILE.name}. Built with React + Tailwind.</p>
            </footer>
          </section>
        </div>

      </div>
    </main>
  )
}