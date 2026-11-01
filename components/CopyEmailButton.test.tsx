import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { CopyEmailButton } from "./CopyEmailButton";

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  vi.useFakeTimers();
  writeText.mockReset().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

// Click, then let the clipboard promise and the state update settle.
const click = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });
};

describe("CopyEmailButton", () => {
  it("copies the email and confirms, then resets after 2 seconds", async () => {
    render(<CopyEmailButton email="fabio@fabiodev.io" />);
    await click();

    expect(writeText).toHaveBeenCalledWith("fabio@fabiodev.io");
    expect(screen.getByRole("button")).toHaveTextContent("Copied");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole("button")).toHaveTextContent("Copy email");
  });

  it("announces the change to screen readers", () => {
    render(<CopyEmailButton email="fabio@fabiodev.io" />);
    expect(screen.getByText("Copy email")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("stays usable when the clipboard is blocked", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    render(<CopyEmailButton email="fabio@fabiodev.io" />);
    await click();

    expect(screen.getByRole("button")).toHaveTextContent("Copy email");
  });

  it("has no accessibility violations", async () => {
    vi.useRealTimers();
    const { container } = render(<CopyEmailButton email="fabio@fabiodev.io" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
