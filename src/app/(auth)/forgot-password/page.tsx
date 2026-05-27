"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function ForgotPasswordPage() {

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token");

  const isResetMode = !!token;

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  // SEND RESET LINK
  const handleSendLink =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await fetch(
            "/api/forgot-password",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                email,
              }),
            }
          );

        const result =
          await response.json();

        if (!result.success) {

          alert(result.message);

          return;
        }

        alert(
          "Reset link sent to your email"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  // RESET PASSWORD
  const handleResetPassword =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {

      e.preventDefault();

      if (
        password !==
        confirmPassword
      ) {

        alert(
          "Passwords do not match"
        );

        return;
      }

      if (password.length < 6) {

        alert(
          "Password must be at least 6 characters"
        );

        return;
      }

      try {

        setLoading(true);

        const response =
          await fetch(
            "/api/reset-password",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                token,
                password,
              }),
            }
          );

        const result =
          await response.json();

        if (!result.success) {

          alert(result.message);

          return;
        }

        alert(
          "Password updated successfully"
        );

        router.push("/login");

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <section className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-6">

      <div className="w-full max-w-xl bg-white rounded-3xl p-8 md:p-12 shadow-sm">

        <h1 className="text-5xl font-bold font-bodoni mb-4">

          {isResetMode
            ? "Reset Password"
            : "Forgot Password"}

        </h1>

        <p className="text-gray-600 mb-10 text-lg">

          {isResetMode
            ? "Create your new password."
            : "Enter your email to receive a reset link."}

        </p>

        {!isResetMode ? (

          <form
            onSubmit={handleSendLink}
            className="space-y-6"
          >

            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14"
            >

              {loading
                ? "Sending..."
                : "Send Reset Link"}

            </Button>

          </form>

        ) : (

          <form
            onSubmit={
              handleResetPassword
            }
            className="space-y-6"
          >

            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              label="Confirm Password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

            <div className="flex items-center gap-2">

              <input
                type="checkbox"
                onChange={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              />

              <p className="text-sm text-gray-600">
                Show Password
              </p>

            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14"
            >

              {loading
                ? "Updating..."
                : "Reset Password"}

            </Button>

          </form>
        )}

        <p className="text-center mt-8 text-gray-600">

          Remember your password?{" "}

          <Link
            href="/login"
            className="font-semibold text-black hover:underline"
          >
            Back to Login
          </Link>

        </p>

      </div>
    </section>
  );
}