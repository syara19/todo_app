"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

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

interface TodoItemProps {
    todo: Todo;
    onTodoUpdated: () => void;
    onTodoDeleted: (id: string) => void;
}

export default function TodoItem({
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
                throw new Error("Failed to delete todo");
            }
            onTodoDeleted(todo.id);
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
                throw new Error("Failed to update todo status");
            }
            onTodoUpdated(); // Re-fetch all todos to update the list
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const getPriorityBadgeClass = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "badge-error";
            case "MEDIUM":
                return "badge-warning";
            case "LOW":
                return "badge-info";
            default:
                return "badge-neutral";
        }
    };

    return (
        <div
            className={`card bg-base-100 shadow-xl ${todo.isDone ? "opacity-60 line-through" : ""
                }`}
        >
            <div className="card-body">
                {error && <div className="alert alert-error mb-2 text-sm">{error}</div>}
                <h2 className="card-title">
                    <Link href={`/todo/${todo.id}`} className="hover:underline">
                        {todo.title}
                    </Link>
                    <div className={`badge ${getPriorityBadgeClass(todo.priority)}`}>
                        {todo.priority}
                    </div>
                </h2>
                {todo.description && (
                    <p className="text-sm text-gray-500">{todo.description}</p>
                )}
                {todo.dueDate && (
                    <p className="text-xs text-gray-400">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                )}
                {todo.label && (
                    <div className="badge badge-outline">{todo.label.title}</div>
                )}
                <div className="card-actions justify-end mt-4">
                    <button
                        className="btn btn-sm btn-success"
                        onClick={handleToggleDone}
                        disabled={isUpdatingStatus}
                    >
                        {isUpdatingStatus ? (
                            <span className="loading loading-spinner"></span>
                        ) : todo.isDone ? (
                            "Mark Undone"
                        ) : (
                            "Mark Done"
                        )}
                    </button>
                    <Link href={`/todo/${todo.id}`} className="btn btn-sm btn-info">
                        View/Edit
                    </Link>
                    <button
                        className="btn btn-sm btn-error"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}