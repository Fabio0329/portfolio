import { site } from "@/lib/site";

export default function Home() {
  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight">{site.name}</h1>
      <p className="mt-2 text-lg text-muted">{site.title}</p>
      <p className="mt-6 text-xl">{site.pitch}</p>
    </section>
  );
}
