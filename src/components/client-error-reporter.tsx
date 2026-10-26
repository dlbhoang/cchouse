"use client";
import { useEffect } from "react";
import { reportClientError } from "@/lib/errors/report";
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
    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
}
