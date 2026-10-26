import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/services/auth/auth";
import { appConst } from "@/lib/core/configs/appConst";
import {
  cleanErrorPath,
  cleanErrorText,
  errorKinds,
  type ErrorKind,
} from "@/lib/errors/types";
import { readClientErrors, saveClientError } from "@/lib/errors/store";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const rates = new Map<string, { start: number; count: number }>();
function isRequestOrigin(request: NextRequest, origin: string) {
  try {
    const submitted = new URL(origin);
    const requestHost = request.headers.get("host")?.trim().toLowerCase();
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim();
    const requestProtocol =
      forwardedProtocol || request.nextUrl.protocol.replace(/:$/, "");
    return (
      Boolean(requestHost) &&
      submitted.host.toLowerCase() === requestHost &&
      submitted.protocol === `${requestProtocol}:`
    );
  } catch {
    return false;
  }
}
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && !isRequestOrigin(request, origin))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const userId = String(session.user.Id);
  const now = Date.now();
  for (const [key, rate] of rates)
    if (now - rate.start > 60000) rates.delete(key);
  const rate = rates.get(userId) ?? { start: now, count: 0 };
  if (++rate.count > 60)
    return NextResponse.json({ message: "Too many reports" }, { status: 429 });
  rates.set(userId, rate);
  try {
    if (Number(request.headers.get("content-length")) > 20000)
      return NextResponse.json(
        { message: "Report too large" },
        { status: 413 },
      );
    const body = await request.text();
    if (body.length > 20000)
      return NextResponse.json(
        { message: "Report too large" },
        { status: 413 },
      );
    const data = JSON.parse(body);
    if (
      !data ||
      typeof data !== "object" ||
      !errorKinds.includes(data.kind) ||
      typeof data.message !== "string" ||
      !data.message.trim()
    )
      return NextResponse.json({ message: "Invalid report" }, { status: 400 });
    await saveClientError({
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      kind: data.kind as ErrorKind,
      message: cleanErrorText(data.message),
      stack: cleanErrorText(data.stack, 8000),
      path: cleanErrorPath(data.path),
      source: cleanErrorPath(data.source),
      status:
        Number.isInteger(data.status) && data.status >= 0 && data.status <= 599
          ? data.status
          : undefined,
      userId,
      userName: cleanErrorText(session.user.Name, 100),
      userAgent: cleanErrorText(request.headers.get("user-agent"), 300),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError)
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    console.error("Client error storage failed", error);
    return NextResponse.json({ message: "Không thể lưu lỗi" }, { status: 503 });
  }
}
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!appConst.MANAGER_ROLES.includes(Number(session.user.RoleId)))
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const day =
    request.nextUrl.searchParams.get("day") ??
    new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Number.isFinite(Date.parse(day)))
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  try {
    const query = (request.nextUrl.searchParams.get("q") ?? "").toLowerCase();
    const kind = request.nextUrl.searchParams.get("kind");
    const rows = (await readClientErrors(day)).filter(
      (row) =>
        (!kind || row.kind === kind) &&
        (!query ||
          `${row.message} ${row.path} ${row.userName} ${row.userId}`
            .toLowerCase()
            .includes(query)),
    );
    const page = Math.max(
      1,
      Number(request.nextUrl.searchParams.get("page")) || 1,
    );
    return NextResponse.json(
      {
        data: rows.slice((page - 1) * 50, page * 50),
        total: rows.length,
        page,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Không thể đọc nhật ký lỗi" },
      { status: 503 },
    );
  }
}
