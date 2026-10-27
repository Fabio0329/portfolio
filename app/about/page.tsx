import type { Metadata } from "next";
import About from "@/content/about.mdx";

export const metadata: Metadata = {
  title: "About",
  description: "How I got here, what I'm good at, and what I'm learning.",
};

export default function AboutPage() {
  return (
    <article>
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="mt-3 text-lg text-muted">
          The longer version: how I got here, what I&apos;m good at, and what
          I&apos;m learning.
        </p>
      </header>
      <div className="prose max-w-none">
        <About />
      </div>
    </article>
  );
}
