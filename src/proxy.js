import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Protect Dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(url);
      res.cookies.delete("token");
      return res;
    }

    // Admin routes protection
    if (pathname.startsWith("/dashboard/admin")) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
