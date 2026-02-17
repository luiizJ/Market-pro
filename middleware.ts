// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Verifica se está tentando acessar o dashboard
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const adminSession = request.cookies.get("admin_session");

    // Se não tiver o cookie, chuta pro login
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

// Configura em quais rotas o middleware roda
export const config = {
  matcher: "/admin/dashboard/:path*",
};
