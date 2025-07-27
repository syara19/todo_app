"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()
  const { status } = useSession()

  if (status === 'authenticated') {
    router.push('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    console.log(form)
    const result = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password
    })

    if(form.email === '' || form.password === '') {
      setError('Email and password are required')
      return
    }

    if(form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/')
      setSuccessMessage('Login successful!')
    }
  }
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-xl rounded-lg p-6">
        <div className="card-body p-0">
          <h2 className="card-title text-2xl font-bold text-center mb-6">Login</h2>

          {error && (
            <div role="alert" className="alert alert-error mb-4 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}
          {successMessage && (
            <div role="alert" className="alert alert-success mb-4 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-md"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full rounded-md"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="form-control mb-6">

            </div>
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary w-full rounded-md"
                disabled={form.email === '' || form.password === ''}
              >
                Login
              </button>
            </div>
          </form>
          <p className="text-center mt-6 text-sm text-gray-600">
            Dont have an account?{" "}
            <Link href="/register" className="link link-primary font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>)
}