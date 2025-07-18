"use client";
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Todo } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import Card from '@/components/Card';
import useSWR from 'swr';

const fetcher = async (url: string, username: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${username}`
    }
  });

  if (!response.ok) {
    throw new Error('Error fetching data');
  }

  return response.json();
};


export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();

  const apiUrl = '/api/todos';

  const { data: todos, error, isLoading, mutate } = useSWR(
    status === 'authenticated' ? [apiUrl, session?.user.username] : null,
    ([url, username]) => fetcher(url, username as string)
  );

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">Error: {error.message}</div>;
  }

  const handleTodoAdded = () => {
    mutate();
  };

  const handleTodoUpdated = () => {
    mutate();
  };
  const handleTodoDeleted = async (id: string) => {
    const newTodos = todos?.filter((todo: Todo) => todo.id !== id);
    mutate(newTodos, false);

    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user.username}`,
        },
      });
      mutate();
    } catch (err) {
      mutate(todos, false); // Revert to previous state
      console.error("Failed to delete todo:", err);
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div role="alert" className="alert alert-error max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Error: {error.message}</span>
          </div>
        </div>
      );
    }
  };


  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8"> {/* Added main, container, mx-auto, px-4, py-8 */}
        <h1 className='text-3xl font-bold mb-6 text-center'>Todo List</h1> {/* Added text-center */}
        <div className="max-w-xl mx-auto"> {/* Added a wrapper for form for better centering */}
          <TodoForm onTodoAdded={handleTodoAdded} />
        </div>

        <div className='mt-6'>
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">No todos yet. Add one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center ">
              {todos.map((todo: Todo) => (
                <Card
                  key={todo.id}
                  todo={todo}
                  onTodoUpdated={handleTodoUpdated}
                  onTodoDeleted={handleTodoDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
