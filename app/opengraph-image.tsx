import { ogSize, renderOgCard } from "@/lib/og";
import { site } from "@/lib/site";

// Default preview image for every page that doesn't define its own.
export const alt = `${site.name} · ${site.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({
    title: site.pitch,
    subtitle: site.description,
  });
}
