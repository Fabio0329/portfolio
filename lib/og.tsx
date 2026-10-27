import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Shared look for every generated link-preview image (1200x630 is the size
// LinkedIn, Slack, and X expect). ImageResponse can't read CSS variables, so
// the colors below mirror the light-theme tokens in app/globals.css.
export const ogSize = { width: 1200, height: 630 };

const colors = {
  background: "#ffffff",
  foreground: "#18181b",
  muted: "#52525b",
  accent: "#4f46e5",
};

type OgCardProps = {
  /** Small label above the title, e.g. "Log" or "Project". */
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export const renderOgCard = ({ eyebrow, title, subtitle }: OgCardProps) =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: colors.background,
        borderTop: `16px solid ${colors.accent}`,
        color: colors.foreground,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow && (
          <div style={{ fontSize: 32, color: colors.accent }}>{eyebrow}</div>
        )}
        <div
          style={{
            marginTop: eyebrow ? 24 : 0,
            fontSize: title.length > 60 ? 56 : 72,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: -1.5,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              lineHeight: 1.4,
              color: colors.muted,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, color: colors.muted }}>
        {`${site.name} · ${site.title}`}
      </div>
    </div>,
    ogSize,
  );
