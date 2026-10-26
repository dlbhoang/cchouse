import "server-only";
import {
  appendFile,
  mkdir,
  readdir,
  readFile,
  stat,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import type { ClientErrorRecord } from "./types";
const directory =
  process.env.CLIENT_ERROR_LOG_DIR ||
  path.join(process.cwd(), ".runtime", "client-errors");
const retention = 30 * 86400000;
let queue: Promise<unknown> = Promise.resolve();
export function saveClientError(record: ClientErrorRecord) {
  const operation = queue.then(async () => {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const filename = path.join(
      directory,
      `${record.createdAt.slice(0, 10)}.jsonl`,
    );
    const size = await stat(filename)
      .then((s) => s.size)
      .catch(() => 0);
    if (size >= 10 * 1024 * 1024)
      throw new Error("Daily error log limit reached");
    await appendFile(filename, `${JSON.stringify(record)}\n`, { mode: 0o600 });
    for (const name of await readdir(directory)) {
      if (
        /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(name) &&
        Date.parse(name.slice(0, 10)) < Date.now() - retention
      )
        await unlink(path.join(directory, name));
    }
  });
  queue = operation.catch(() => {});
  return operation;
}
export async function readClientErrors(
  day: string,
): Promise<ClientErrorRecord[]> {
  try {
    const content = await readFile(
      path.join(directory, `${day}.jsonl`),
      "utf8",
    );
    return content
      .split("\n")
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as ClientErrorRecord];
        } catch {
          return [];
        }
      })
      .reverse();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}
