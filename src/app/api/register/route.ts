import { prisma } from "@/lib/prismaClient";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, roleId } = body;

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
    if (!roleId || typeof roleId !== "string" || roleId.trim() === "") {
      return NextResponse.json(
        { message: "Role ID is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await prisma.user.create({
      data: {
        username,
        password: passwordHashed,
        roleId,
      },
    });

    return NextResponse.json({ message: "User created successfully" });
  } catch (e) {
    console.log(e);

    if (e.code === "P2002" && e.meta?.target?.includes("username")) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }
    if (e instanceof SyntaxError && e.message.includes("JSON")) {
      return NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error creating user", details: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
