// src/services/auth/logout.ts
import { signOut } from "next-auth/react";

import { axiosClient } from "@/services/api/api_config";

/**
 * Đăng xuất đúng cách:
 * 1. Gọi API backend để xoá session-lock cache (tránh lỗi
 *    "đang đăng nhập ở thiết bị khác" khi đăng nhập lại).
 * 2. Sau đó mới xoá session NextAuth ở phía client.
 *
 * Phải gọi API TRƯỚC khi signOut, vì signOut xoá token khỏi
 * session -> sau đó không còn cách nào xác thực để gọi API nữa.
 */
export async function performLogout(
  options?: Parameters<typeof signOut>[0]
) {
  try {
    await axiosClient.post("/AdminAuth/Logout");
  } catch {
    // Best-effort: nếu gọi thất bại (mất mạng, token đã hết hạn sẵn...)
    // vẫn tiếp tục đăng xuất phía client, không được block người dùng.
  }
  return signOut(options);
}