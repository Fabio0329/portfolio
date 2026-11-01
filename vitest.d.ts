// vitest-axe 0.1 declares its matcher on the old global `Vi` namespace, which
// current Vitest ignores. Register `toHaveNoViolations()` on Vitest's
// `Matchers` interface instead (type parameters must match Vitest's own).
declare module "vitest" {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>> {
    /** Fails if axe found accessibility violations. */
    toHaveNoViolations(): R;
  }
}

export {};
