"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";


interface Role {
    id: string;
    name: string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch data");
    }
    return res.json();
};

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedRoleId, setSelectedRoleId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { data: roles, error: rolesError, isLoading: rolesLoading } = useSWR<Role[]>("/api/roles", fetcher);

    useEffect(() => {
        if (roles && roles.length > 0 && !selectedRoleId) {
            setSelectedRoleId(roles[0].id);
        }
    }, [roles, selectedRoleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (!selectedRoleId) {
            setError("Please select a role.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, roleId: selectedRoleId }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            setSuccessMessage("Registration successful! You can now log in.");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setSelectedRoleId(roles && roles.length > 0 ? roles[0].id : "");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-100">
            <div className="card w-96 bg-white shadow-xl rounded-lg p-6">
                <div className="card-body p-0">
                    <h2 className="card-title text-2xl font-bold text-center mb-6">Register</h2>

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
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="input input-bordered w-full rounded-md"
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
                                placeholder="Enter your password"
                                className="input input-bordered w-full rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                className="input input-bordered w-full rounded-md"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">Select Role</span>
                            </label>
                            {rolesLoading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : rolesError ? (
                                <p className="text-red-500 text-sm">Error loading roles.</p>
                            ) : (
                                <select
                                    className="select select-bordered w-full rounded-md"
                                    value={selectedRoleId}
                                    onChange={(e) => setSelectedRoleId(e.target.value)}
                                    required
                                >
                                    {!selectedRoleId && <option value="" disabled>Select a role</option>}
                                    {roles?.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className="btn btn-primary w-full rounded-md"
                                disabled={loading || rolesLoading || !selectedRoleId}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : "Register"}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-6 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="link link-primary font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}