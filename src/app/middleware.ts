import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default async function middleware(request) {
  const loginPath = ["/login", "/register"];

  const accessToken = request.cookies.get(process.env.JWT);
}
