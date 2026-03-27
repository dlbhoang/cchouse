import { cp } from "node:fs/promises";

(async () => {
  try {
    await cp("public", ".next/standalone/public", { recursive: true });
    await cp(".next/static", ".next/standalone/.next/static", { recursive: true });
    console.log("✅ Copy thành công!");
  } catch (err) {
    console.error("❌ Lỗi:", err);
  }
})();