"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SignInPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Header */}
          <div className="mb-8 space-y-2 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600">Sign in to LetterFlow to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">
                {error === "OAuthSignin" || error === "OAuthCallback"
                  ? "Failed to sign in with Google. Please try again."
                  : "Sign in failed. Please try again."}
              </p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={() =>
              signIn("google", {
                callbackUrl,
              })
            }
            className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-3 border-2 border-slate-200 hover:border-slate-300"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-sm text-slate-500">or continue</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Footer Links */}
          <div className="space-y-3 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <button
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/new",
                  })
                }
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign up with Google
              </button>
            </p>
            <div className="pt-2">
              <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <p className="mt-4 text-center text-xs text-slate-500">
          Secured by NextAuth with Google OAuth
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4" />}>
      <SignInPageContent />
    </Suspense>
  );
}
