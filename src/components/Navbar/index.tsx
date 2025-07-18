"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          My TodoList
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {status === "authenticated" ? (
            <>
              <li>
                <button onClick={() => signOut()}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}