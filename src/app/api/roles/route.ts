import { prisma } from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error("Error fetching roles:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "Failed to fetch roles",
          details: error.message || "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Role name is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const existingRole = await prisma.role.findUnique({
      where: { name },
    });
    if (existingRole) {
      return NextResponse.json(
        { message: "Role with this name already exists" },
        { status: 400 }
      );
    }

    const newRole = await prisma.role.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "Failed to create role",
          details: error.message || "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}
