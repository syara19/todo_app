import { prisma } from "@/lib/prismaClient";
import { authenticateRoute } from "@/middleware/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRoute(request);
    if (!authResult.authenticated) {
      return authResult.response; 
    }

    const { id } = params;
    const userId = authResult.user?.userId as string; 

    const todo = await prisma.todoList.findUnique({
      where: {
        id,
        userId, 
      },
      include: {
        label: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!todo) {
      return NextResponse.json(
        { error: "Todo not found or you do not have access" },
        { status: 404 }
      );
    }
    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRoute(request);
    if (!authResult.authenticated) {
      return authResult.response; 
    }

    const { id } = params;
    const userId = authResult.user?.userId;

    const { title, description, labelId, priority, isDone, dueDate } =
      await request.json();

    
    const existingTodo = await prisma.todoList.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingTodo || existingTodo.userId !== userId) {
      return NextResponse.json(
        {
          error: "Todo not found or you are not authorized to update this todo",
        },
        { status: 403 } 
      );
    }

    const updatedTodo = await prisma.todoList.update({
      where: {
        id,
        userId, 
      },
      data: {
        title,
        description,
        labelId: labelId || null,
        priority: priority || "LOW",
        isDone: typeof isDone === "boolean" ? isDone : false, 
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRoute(request);
    if (!authResult.authenticated) {
      return authResult.response; 
    }

    const { id } = await params;
    const userId = authResult.user?.userId; 

    console.log("Deleting todo with ID:", id, "for User ID:", userId);

    const existingTodo = await prisma.todoList.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingTodo || existingTodo.userId !== userId) {
      console.warn("Attempt to delete unauthorized todo:", {
        todoId: id,
        authenticatedUserId: userId,
        ownerId: existingTodo?.userId,
      });
      return NextResponse.json(
        {
          error: "Todo not found or you are not authorized to delete this todo",
        },
        { status: 403 } 
      );
    }

    await prisma.todoList.delete({
      where: {
        id,
        userId, 
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting todo:", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { error: "Todo not found or already deleted." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
