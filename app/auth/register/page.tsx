"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRegisterUser } from "@/react-query/users";
import { useErrorModal } from "@/hooks";
import { ErrorModal } from "@/components/common";
import { LoadingSpinner } from "@/assets/icons";

export default function RegisterPage() {
  const router = useRouter();
  const { errorModal, showError, hideError } = useErrorModal();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const registerMutation = useRegisterUser();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showError("Validation Error", "Passwords do not match");
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
      });

      setSuccessMessage(result.message);
      
      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });

      // Redirect to sign in after a few seconds
      setTimeout(() => {
        router.push("/auth/signin?message=registration-success");
      }, 3000);

    } catch (error: any) {
      showError("Registration Failed", error.message);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">Create Account</h1>
      
      {successMessage ? (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <h3 className="font-medium mb-2">Registration Successful!</h3>
          <p className="text-sm">{successMessage}</p>
          <p className="text-sm mt-2">Redirecting to sign in page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">First Name</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John"
                disabled={isLoading}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Last Name</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Doe"
                disabled={isLoading}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email *</span>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
              disabled={isLoading}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Password *</span>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Confirm Password *</span>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white rounded-lg p-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner className="loading loading-spinner loading-sm" />}
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a 
                href="/auth/signin" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </a>
            </p>
          </div>
        </form>
      )}

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={hideError}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  );
}
