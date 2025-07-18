"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { use, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FcHighPriority } from "react-icons/fc";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";

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
    return (
        <div className={`card rounded-xl w-96 h-[180px] bg-base-100 card-xs p-4 shadow-sm ${todo.isDone ? "opacity-60 line-through" : ""
            }`}>
            <div>
                <div className="card-body my-2">
                    <div className="flex items-center">
                        <h2 className="card-title text-xl line-clamp-1 me-2">{todo.title}</h2>
                        <FcHighPriority />
                    </div>
                    <p className="line-clamp-2 text-stone-600">{todo.description}</p>
                </div>
                <p className="text-stone-600 text-xs">Due Date</p>
                <div className="badge badge-ghost absolute bottom-2 left-2">label</div>
                <div className="absolute bottom-2 right-2 card-actions">
                    <button onClick={handleToggleDone} className="btn btn-primary w-7 h-7 btn-circle">
                        <IoMdCheckmarkCircleOutline size={15} />
                    </button>
                    <Link href={`/todo/${todo.id}`}>
                        <button className="btn btn-primary w-7 h-7 btn-circle">
                            <CiEdit size={15} />
                        </button>
                    </Link>
                    <button onClick={handleDelete} className="btn btn-primary w-7 h-7 btn-circle">
                        <MdDelete size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}