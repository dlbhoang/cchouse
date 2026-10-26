export const errorKinds = [
  "runtime",
  "promise",
  "react",
  "api",
  "resource",
  "console",
] as const;
export type ErrorKind = (typeof errorKinds)[number];
export type ClientErrorInput = {
  kind: ErrorKind;
  message: string;
  stack?: string;
  path?: string;
  source?: string;
  status?: number;
};
export type ClientErrorRecord = ClientErrorInput & {
  id: string;
  createdAt: string;
  userId: string;
  userName: string;
  userAgent: string;
};

// Never persist query strings, credentials, email addresses or form/request bodies.
export function cleanErrorText(value: unknown, max = 2000): string {
  return String(value ?? "")
    .replace(/https?:\/\/[^\s)]+/g, (url) => url.split(/[?#]/)[0])
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(
      /((?:password|token|secret|authorization|cookie)\s*[=:]\s*)[^\s,;]+/gi,
      "$1[redacted]",
    )
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[email]")
    .slice(0, max);
}
export function cleanErrorPath(value: unknown): string {
  const text = String(value ?? "");
  try {
    return new URL(text, "http://local").pathname.slice(0, 500);
  } catch {
    return "/";
  }
}

export function summarizeConsoleError(args: unknown[]) {
  let stack: string | undefined;
  const messages = args
    .map((value) => {
      if (value instanceof Error) {
        stack ??= value.stack;
        return `${value.name || "Error"}: ${value.message}`;
      }
      if (typeof value === "string") return value;
      if (value && typeof value === "object") {
        const record = value as {
          name?: unknown;
          message?: unknown;
          stack?: unknown;
        };
        if (typeof record.message === "string") {
          if (!stack && typeof record.stack === "string") stack = record.stack;
          return `${typeof record.name === "string" ? `${record.name}: ` : ""}${record.message}`;
        }
        return "[object]";
      }
      return String(value ?? "");
    })
    .filter(Boolean);
  return {
    message: messages.join(" ").slice(0, 2000) || "console.error called",
    stack,
  };
}
