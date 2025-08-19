"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import type { SignInResponse } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage(){
  const router = useRouter();
  const search = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = search.get("callbackUrl") ?? "/dashboard";

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
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border p-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-2"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-2 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl border p-2 font-medium disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
