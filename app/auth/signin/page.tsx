"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage(){
  const router = useRouter();
  const search = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = search.get("callbackUrl") ?? "/dashboard";
  const message = search.get("message");

  // Show success message for registration
  const getSuccessMessage = () => {
    if (message === "registration-success") {
      return "Registration successful! Your account is pending approval. Please sign in.";
    }
    return null;
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = (await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })) as SignInResponse | undefined;

      if (res?.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // On success, NextAuth gives us a url to redirect to
      if (res?.ok && res.url) {
        router.push(res.url);
      } else {
        // Fallback
        router.push(callbackUrl);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome Back!</h1>
          <p className="py-6">
            Sign in to your MFKLMS account to manage loans, repayments, and more.
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit} className="card-body">
            <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                placeholder="••••••••"
              />
            </div>

            {getSuccessMessage() && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getSuccessMessage()}</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-sm">Don&apos;t have an account? </span>
              <Link href="/auth/register" className="link link-primary text-sm">
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
