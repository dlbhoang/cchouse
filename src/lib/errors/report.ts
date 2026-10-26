import { cleanErrorPath, cleanErrorText, type ClientErrorInput } from "./types";
const recent = new Map<string, number>();
let sent = 0;
let windowStart = 0;
export function reportClientError(input: ClientErrorInput) {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - windowStart > 60000) {
    sent = 0;
    windowStart = now;
    recent.clear();
  }
  const data = {
    ...input,
    message: cleanErrorText(input.message),
    stack: cleanErrorText(input.stack, 8000),
    path: cleanErrorPath(window.location.pathname),
    source: cleanErrorPath(input.source ?? ""),
  };
  const key = `${data.message}:${data.path}`;
  if (sent >= 20 || now - (recent.get(key) ?? 0) < 30000) return;
  recent.set(key, now);
  sent++;
  void fetch("/api/client-errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(() => {});
}
