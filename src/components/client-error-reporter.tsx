"use client";
import { useEffect } from "react";
import { reportClientError } from "@/lib/errors/report";
import { summarizeConsoleError } from "@/lib/errors/types";
export default function ClientErrorReporter() {
  useEffect(() => {
    const onError = (event: ErrorEvent | Event) => {
      if (event instanceof ErrorEvent) {
        reportClientError({
          kind: "runtime",
          message: event.message || "Lỗi JavaScript",
          stack: event.error?.stack,
          source: event.filename,
        });
      } else {
        const target = event.target;
        if (
          target instanceof HTMLScriptElement ||
          target instanceof HTMLLinkElement
        )
          reportClientError({
            kind: "resource",
            message: "Không tải được tài nguyên",
            source:
              target instanceof HTMLScriptElement ? target.src : target.href,
          });
      }
    };
    const onRejection = (event: PromiseRejectionEvent) =>
      reportClientError({
        kind: "promise",
        message:
          event.reason instanceof Error
            ? event.reason.message
            : String(event.reason ?? "Promise rejected"),
        stack: event.reason?.stack,
      });
    const originalConsoleError = window.console.error;
    const originalFetch = window.fetch;
    const onFetch: typeof window.fetch = async (input, init) => {
      const requestUrl = input instanceof Request ? input.url : String(input);
      const url = new URL(requestUrl, window.location.href);
      const shouldTrack =
        !url.pathname.startsWith("/api/client-errors") &&
        !url.pathname.startsWith("/_next/");
      const method = String(
        init?.method ?? (input instanceof Request ? input.method : "GET"),
      ).toUpperCase();
      try {
        const response = await originalFetch.call(window, input, init);
        if (shouldTrack && !response.ok) {
          reportClientError({
            kind: "api",
            message: `${method} ${response.status}: Fetch request thất bại`,
            source: url.pathname,
            status: response.status,
          });
        }
        return response;
      } catch (error) {
        if (
          shouldTrack &&
          !(error instanceof DOMException && error.name === "AbortError")
        ) {
          reportClientError({
            kind: "api",
            message: `${method} network: Fetch không kết nối được`,
            stack: error instanceof Error ? error.stack : undefined,
            source: url.pathname,
            status: 0,
          });
        }
        throw error;
      }
    };
    const onConsoleError = (...args: unknown[]) => {
      const summary = summarizeConsoleError(args);
      reportClientError({ kind: "console", ...summary });
      originalConsoleError.apply(window.console, args);
    };
    window.console.error = onConsoleError;
    window.fetch = onFetch;
    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.console.error = originalConsoleError;
      window.fetch = originalFetch;
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
