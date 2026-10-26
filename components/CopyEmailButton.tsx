"use client";

import { useEffect, useRef, useState, type FC } from "react";

type CopyEmailButtonProps = {
  email: string;
};

export const CopyEmailButton: FC<CopyEmailButtonProps> = ({ email }) => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(resetTimer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      // Restart the timer so repeat clicks don't reset the label early.
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the mailto link next to this still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:text-foreground"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
};
