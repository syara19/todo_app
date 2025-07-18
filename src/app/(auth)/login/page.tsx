"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { status } = useSession()

  // Redirect if already authenticated
  if (status === 'authenticated') {
    router.push('/')
    return null // Don't render anything while redirecting
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear previous errors

    const result = await signIn('credentials', {
      redirect: false, // Prevent NextAuth from redirecting automatically
      username,
      password,
    })

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/') // Redirect to home page on successful login
    }
  }
  return(
  <div className="flex items-center justify-center min-h-screen bg-base-200">
  <div className="card w-96 bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-center block mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            className="input input-bordered w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div role="alert" className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        Don't have an account?{' '}
        <Link href="/register" className="link link-primary">
          Register
        </Link>
      </div>
    </div>
  </div>
</div>)
}