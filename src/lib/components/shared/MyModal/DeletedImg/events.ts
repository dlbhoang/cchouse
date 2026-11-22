import dayjs from "dayjs";
import type { IFileUploadResponse } from "@/services/api/imagesApi";

type MediaEvent = {
  time: number;
  timestamp: string;
  actor: string;
  added: IFileUploadResponse[];
  removed: IFileUploadResponse[];
};

export function groupMediaEvents(files: IFileUploadResponse[]) {
  const events = new Map<string, MediaEvent>();
  for (const file of files) {
    const changes = [
      { timestamp: file.CreatedDate, actor: file.CreatedBy, removed: false },
      ...(file.IsDeleted
        ? [{ timestamp: file.UpdatedDate, actor: file.UpdatedBy, removed: true }]
        : []),
    ];

    for (const change of changes) {
      if (!change.timestamp) continue;
      const date = dayjs(change.timestamp);
      if (!date.isValid()) continue;
      const time = date.startOf("second").valueOf();
      const key = JSON.stringify([time, change.actor]);
      let event = events.get(key);
      if (!event) {
        event = {
          time,
          timestamp: date.format("DD/MM/YYYY HH:mm:ss"),
          actor: change.actor,
          added: [],
          removed: [],
        };
        events.set(key, event);
      }
      (change.removed ? event.removed : event.added).push(file);
    }
  }
  return [...events.values()].sort((a, b) => b.time - a.time);
}
