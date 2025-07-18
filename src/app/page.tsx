"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Todo } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import Card from '@/components/Card';

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated') {
      fetchTodos()
    }
  }, [status, router])

  const fetchTodos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/todos', {
        headers: {
          Authorization: `Bearer ${session?.user.username}`
        }
      })

      if (!response.ok) {
        throw new Error('Error fetching todos data')
      }

      const data = await response.json()
      setTodos(data)

    } catch (error: any) {
      setError('Error fetching todos')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  const handleTodoAdded = async (newTodo: Todo) => {
    await fetchTodos(); // Re-fetch todos to get the latest list
  };

  const handleTodoUpdated = async () => {
    await fetchTodos();
  };

  const handleTodoDeleted = async (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  if (error) {
    return <div className="alert alert-error">Error: {error}</div>;
  }


  return (
    <>
      <Navbar />
      <div>

        <h1 className='text-3xl font-bold mb-6'>Todo List</h1>
        <TodoForm onTodoAdded={handleTodoAdded} />

        <div className='mt-6'>
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">No todos yet. Add one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5  justify-items-center ">
              {todos.map((todo) => (
                /*        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onTodoUpdated={handleTodoUpdated}
                          onTodoDeleted={handleTodoDeleted}
                        />*/
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
      </div>

    </>
  )
}
