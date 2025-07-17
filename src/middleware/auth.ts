import { verifyJwt } from "@/lib/tokenManager";
import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateRoute(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = await verifyJwt(token);

    if (!payload) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { message: "Invalid or expired token" },
          { status: 403 }
        ),
      };
    }

    return { authenticated: true, user: payload as JWTPayload };
  } catch (error) {
    console.error("Authentication Error:", error);
    return {
      authenticated: false,
      response: NextResponse.json(
        { message: "Failed to authenticate token" },
        { status: 500 }
      ),
    };
  }
}
