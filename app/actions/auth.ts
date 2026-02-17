// src/app/actions/auth.ts
"use server";

import { cookies } from "next/headers";

const MASTER_PIN = process.env.ADMIN_PIN || "1234";

export async function setAdminCookie(pin: string) {
  if (pin === MASTER_PIN) {
    // Cria um cookie seguro que dura 1 dia
    (await cookies()).set("admin_session", "true", {
      httpOnly: true, // JavaScript não acessa (protege contra XSS)
      secure: process.env.NODE_ENV === "production", // Só HTTPS em prod
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });
    return { success: true };
  }
  return { success: false };
}

export async function logoutAdmin() {
  (await cookies()).delete("admin_session");
  return { success: true };
}
