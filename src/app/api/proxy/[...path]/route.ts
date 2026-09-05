import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/services/auth/auth";

export const dynamic = "force-dynamic";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "cookie",
  "authorization",
  "accept-encoding",
]);

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { message: "Thiếu cấu hình NEXT_PUBLIC_API_URL trên server" },
      { status: 500 }
    );
  }

  const { path } = await params;
  const targetPath = (path ?? []).join("/");
  const targetUrl = `${API_BASE_URL.replace(/\/$/, "")}/${targetPath}${req.nextUrl.search}`;

  const session = await auth();

  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) {
      forwardHeaders.set(key, value);
    }
  });
  if (!forwardHeaders.has("content-type")) {
    forwardHeaders.set("content-type", "application/json");
  }
  if (session?.user?.token) {
    forwardHeaders.set("Authorization", `Bearer ${session.user.token}`);
  }

  const init: RequestInit = {
    method: req.method,
    headers: forwardHeaders,
    // @ts-expect-error - duplex is required by undici when streaming a body but not in the DOM lib types yet
    duplex: "half",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    const bodyText = await req.text();
    if (bodyText) init.body = bodyText;
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(targetUrl, init);
  } catch (err) {
    console.error("Proxy fetch error:", err);
    return NextResponse.json(
      { message: "Không thể kết nối tới máy chủ" },
      { status: 502 }
    );
  }

  const resBody = await upstreamRes.arrayBuffer();
  const contentType = upstreamRes.headers.get("content-type") ?? "application/json";

  return new NextResponse(resBody, {
    status: upstreamRes.status,
    headers: { "Content-Type": contentType },
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
