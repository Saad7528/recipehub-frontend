import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function proxy(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Protect Dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    let isCrossDomain = false;
    try {
      const apiDomain = new URL(apiUrl).hostname;
      const reqDomain = req.nextUrl.hostname;
      isCrossDomain = apiDomain !== reqDomain && !apiDomain.endsWith(reqDomain) && !reqDomain.endsWith(apiDomain);
    } catch (e) {
      // Ignore URL parsing errors
    }

    // If it's a cross-domain setup, the frontend server cannot access the HttpOnly cookie
    // set on the backend domain. In this case, we bypass server-side redirect in middleware
    // and rely on client-side layout redirect.
    if (isCrossDomain) {
      return NextResponse.next();
    }

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
