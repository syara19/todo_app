import { prisma } from "@/lib/prismaClient";
import { authenticateRoute } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authResult = await authenticateRoute(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const todos = await prisma.todoList.findMany({
    where: {
      userId: authResult.user!.userId as string,
    },
    include: {
      label: true,
    },
    orderBy:{
      isDone: 'asc',
    }
  });
  console.log(todos);
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRoute(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const userId = authResult.user!.userId;
    const { title, description, labelId, priority, dueDate } =
      await request.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }
    const newTodoList = await prisma.todoList.create({
      data: {
        title,
        description,
        labelId: labelId || null,
        priority: priority || "LOW",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: userId as string,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        label: true,
      },
    });
    return NextResponse.json(newTodoList, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
