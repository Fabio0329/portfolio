import { site } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-2 text-lg">{site.title}</p>
      <p className="mt-6 text-xl">{site.pitch}</p>
    </main>
  );
}
