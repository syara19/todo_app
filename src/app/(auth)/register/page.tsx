"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            // Optionally, you can automatically log in the user after successful registration
            // const signInResult = await signIn("credentials", {
            //   redirect: false,
            //   username,
            //   password,
            // });
            // if (signInResult?.error) {
            //   setError(signInResult.error);
            // } else {
            //   router.push("/");
            // }

            alert("Registration successful! You can now log in.");
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Register</h2>
                    {error && <div className="alert alert-error mb-4">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="username"
                                className="input input-bordered w-full"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="confirm password"
                                className="input input-bordered w-full"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="card-actions justify-end">
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                {loading ? <span className="loading loading-spinner"></span> : "Register"}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="link link-primary">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}