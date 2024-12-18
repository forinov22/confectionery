import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserSession } from "./app/lib/api";

const protectedRoutes = ["/cart", "/orders"];

const setSessionUser = async () => {
  const userSessionResponse = await getUserSession();

  if (userSessionResponse.success) {
    const res = NextResponse.next();

    res.cookies.set("user", JSON.stringify(userSessionResponse.data), {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res;
  }

  return NextResponse.next();
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = await setSessionUser();

  if (protectedRoutes.some((route) => pathname.endsWith(route))) {
    const user = request.cookies.get("user")?.value;

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/(.*)"],
};
