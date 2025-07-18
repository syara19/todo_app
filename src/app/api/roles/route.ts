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
        name: 'asc' 
      }
    });

    return NextResponse.json(roles, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { message: "Failed to fetch roles", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}