import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateRoute(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  try {
    const user = {
      userId: token.id as string,
      username: token.username as string,
      role: token.role as string,
    };
    return {
      authenticated: true,
      user,
    };
  } catch (e) {
    console.error("Token verification failed", e);
    return {
      authenticated: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
}
