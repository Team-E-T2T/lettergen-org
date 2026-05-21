"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-xl text-center w-[400px]">
        <h1 className="text-4xl font-bold text-white mb-4">
          Login Page
        </h1>

        <p className="text-gray-300 mb-8">
          Sign in using your Google account
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
