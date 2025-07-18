"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FcHighPriority, FcMediumPriority, FcLowPriority } from "react-icons/fc"; // Import other priority icons
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Todo } from '@/types/todo'; // Import Todo and Label types

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: () => void;
  onTodoDeleted: (id: string) => void;
}

export default function Card({
  todo,
  onTodoUpdated,
  onTodoDeleted,
}: TodoItemProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user.username}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to delete todo: ${errorData.message}`);
      }
      onTodoDeleted(todo.id); // Call parent handler to update SWR cache
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleDone = async () => {
    setIsUpdatingStatus(true);
    setError(null);
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.username}`,
        },
        body: JSON.stringify({ isDone: !todo.isDone }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Failed to update todo status: ${errorData.message}`);
      }
      onTodoUpdated(); // Re-fetch all todos to update the list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getPriorityIcon = (priority: "HIGH" | "MEDIUM" | "LOW") => {
    switch (priority) {
      case "HIGH":
        return <FcHighPriority size={20} />;
      case "MEDIUM":
        return <FcMediumPriority size={20} />;
      case "LOW":
        return <FcLowPriority size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className={`card rounded-xl w-96 min-h-[180px] bg-base-100 p-4 shadow-sm relative ${todo.isDone ? "opacity-60 line-through" : ""}`}>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div className="card-body my-2">
        <div className="flex items-center">
          <h2 className="card-title text-xl line-clamp-1 me-2">{todo.title}</h2>
          {getPriorityIcon(todo.priority)}
        </div>
        <p className="line-clamp-2 text-stone-600">{todo.description}</p>
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-2">
        {todo.dueDate && (
          <span className="text-stone-600 text-xs">Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
        )}
        {todo.label && (
          <div className={`badge badge-ghost 200 '}`}>
            {todo.label.title}
          </div>
        )}
      </div>

      <div className="absolute bottom-2 right-2 card-actions">
        <button
          onClick={handleToggleDone}
          className="btn btn-primary w-7 h-7 btn-circle"
          disabled={isUpdatingStatus || isDeleting}
          title={todo.isDone ? "Mark as Not Done" : "Mark as Done"}
        >
          <IoMdCheckmarkCircleOutline size={15} />
        </button>
        <Link href={`/todo/${todo.id}`}>
          <button
            className="btn btn-primary w-7 h-7 btn-circle"
            disabled={isUpdatingStatus || isDeleting}
            title="Edit Todo"
          >
            <CiEdit size={15} />
          </button>
        </Link>
        <button
          onClick={handleDelete}
          className="btn btn-primary w-7 h-7 btn-circle"
          disabled={isDeleting || isUpdatingStatus}
          title="Delete Todo"
        >
          <MdDelete size={15} />
        </button>
      </div>
    </div>
  );
}