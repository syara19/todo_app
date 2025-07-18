import { prisma } from "@/lib/prismaClient";
import { error } from "console";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || typeof username !== "string" || username.trim() === "") {
      return NextResponse.json(
        { message: "Username is required and must be a non-empty string" },
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


    const user = await prisma.user.findUnique({
      where: { username},
    });
    const isPasswordValid = await bcrypt.compare(password, user?.password as string);
    console.log(isPasswordValid)

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await signJwt({ userId: user?.id });
    // console.log(token);

    return NextResponse.json(
      { message: "login success", token },
      { status: 200 }
    );
  } catch (error) {}
  console.error(error);
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}
