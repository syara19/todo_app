import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { verifyPassword } from "@/lib/bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        { message: "email is required and must be a non-empty string" },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          message:
            "Password is required and must be a string of at least 6 characters",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });
    console.log("User found in custom API:", user); 
 
    if (!user ) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    const isPasswordValid = await verifyPassword(
      password,
      user?.password as string
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }
    
    const token = await signJwt({ userId: user?.id });
    
    return NextResponse.json(
      { message: "login success", token },
      { status: 200 }
    );
  } catch (error) {

    
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }
    console.error("Error logging in:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status:  500 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
