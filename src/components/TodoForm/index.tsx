"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface TodoFormProps {
  onTodoAdded: (todo: any) => void;
  initialData?: any; 
  onTodoUpdated?: (todo: any) => void; 
}

export default function TodoForm({
  onTodoAdded,
  initialData,
  onTodoUpdated,
}: TodoFormProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState(initialData?.priority || "LOW");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title) {
      setError("Title is required.");
      setLoading(false);
      return;
    }

    try {
      const method = initialData ? "PUT" : "POST";
      const url = initialData ? `/api/todos/${initialData.id}` : "/api/todos";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.username}`, // Example for token
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate: dueDate || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save todo");
      }

      const data = await res.json();
      if (initialData) {
        onTodoUpdated && onTodoUpdated(data);
      } else {
        onTodoAdded(data);
        setTitle("");
        setDescription("");
        setPriority("LOW");
        setDueDate("");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl p-6 mb-8">
      <h2 className="card-title mb-4">
        {initialData ? "Edit To-Do" : "Add New To-Do"}
      </h2>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Buy groceries"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          placeholder="Optional description"
          className="textarea textarea-bordered h-24 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Priority</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text">Due Date</span>
        </label>
        <input
          type="date"
          className="input input-bordered w-full"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : initialData ? (
          "Update To-Do"
        ) : (
          "Add To-Do"
        )}
      </button>
    </form>
  );
}