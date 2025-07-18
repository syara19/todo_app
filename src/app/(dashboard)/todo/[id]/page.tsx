"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TodoForm from "@/components/TodoForm";
import Link from "next/link";

interface Label {
  id: string;
  title: string;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  isDone: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: string;
  label?: Label;
}

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && id) {
      fetchTodo();
    }
  }, [status, router, id]);

  const fetchTodo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.username}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch todo");
      }
      const data = await res.json();
      setTodo(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTodoUpdated = () => {
    fetchTodo(); 
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">Error: {error}</div>;
  }

  if (!todo) {
    return <div className="alert alert-info">Todo not found.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit To-Do</h1>
      <TodoForm initialData={todo} onTodoUpdated={handleTodoUpdated} />
      <div className="mt-4">
        <Link href="/" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    </div>
  );
}