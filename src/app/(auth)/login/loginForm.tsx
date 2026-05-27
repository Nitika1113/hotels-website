"use client";

import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

import { loginSchema } from "@/lib/validations/auth.schema";

import { LoginFormData } from "@/types/auth";

import {
  LOGIN_PAGE_TEXT,
  LOGIN_FIELDS,
  LOGIN_IMAGE,
  LOGIN_TESTIMONIAL,
  SOCIAL_PROVIDERS,
} from "@/app/(auth)/login/config";

export default function LoginForm() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver:
      zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {

    try {

      setLoading(true);

      const response = await fetch(
        "/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
        }
      );

      const result =
        await response.json();

      if (!result.success) {

        alert(result.message);

        return;
      }

      alert("Login Successful");

      router.push("/");

      router.refresh();

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2 overflow-hidden">

      {/* LEFT */}
      <div className="bg-[#f8f8f8] flex items-center px-18 py-5">

        <div className="w-full max-w-xl">

          <h1 className="text-6xl font-bold font-bodoni mb-5">
            {LOGIN_PAGE_TEXT.heading}
          </h1>

          <p className="text-gray-600 text-xl mb-12 leading-relaxed">
            {LOGIN_PAGE_TEXT.subheading}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >

            {LOGIN_FIELDS.map((field) => (

              <div key={field.name}>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-medium">
                    {field.label}
                  </label>

                  {field.name ===
                    "password" && (

                    <Link
                      href={
                        LOGIN_PAGE_TEXT.forgotPasswordHref
                      }
                      className="text-sm text-[#8c7b4f]"
                    >
                      {
                        LOGIN_PAGE_TEXT.forgotPassword
                      }
                    </Link>
                  )}
                </div>

                <div className="relative">

                  <Input
                    type={
                      field.name === "password" &&
                      showPassword
                        ? "text"
                        : field.type
                    }
                    placeholder={
                      field.placeholder
                    }
                    {...register(field.name)}
                  />

                  {field.name === "password" && (

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >

                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}

                    </button>
                  )}
                </div>

                {errors[field.name] && (

                  <p className="text-red-500 text-sm mt-2">

                    {
                      errors[field.name]
                        ?.message
                    }

                  </p>
                )}
              </div>
            ))}

            {/* TERMS */}
            <div>

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  {...register("terms")}
                />

                <p className="text-sm text-gray-600">

                  {
                    LOGIN_PAGE_TEXT.keepSign
                  }

                </p>
              </div>

              {errors.terms && (

                <p className="text-red-500 text-sm mt-2">

                  {errors.terms.message}

                </p>
              )}
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-base"
            >

              {loading
                ? "Signing In..."
                : LOGIN_PAGE_TEXT.submitButton}

            </Button>
          </form>

          {/* SOCIAL */}
          <div className="mt-5">

            <div className="flex items-center gap-4">

              <div className="h-0.5 bg-gray-300 flex-1" />

              <span className="text-gray-400 text-md">

                {
                  LOGIN_PAGE_TEXT.dividerText
                }

              </span>

              <div className="h-0.5 bg-gray-300 flex-1" />

            </div>

            <div className="flex items-center justify-center gap-8 mt-6">

              {SOCIAL_PROVIDERS.map(
                (provider) => (

                <Button
                  key={provider.id}
                  type="button"
                  variant="social"
                  className="w-16 h-14 p-0"
                >

                  <Image
                    src={provider.icon}
                    alt={provider.label}
                    width={26}
                    height={26}
                  />

                </Button>
              ))}
            </div>
          </div>

          {/* REGISTER */}
          <p className="text-center mt-10 text-gray-600">

            {
              LOGIN_PAGE_TEXT.registerPrompt
            }{" "}

            <Link
              href={
                LOGIN_PAGE_TEXT.registerHref
              }
              className="font-semibold text-black"
            >

              {
                LOGIN_PAGE_TEXT.registerLinkLabel
              }

            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative hidden lg:block">

        <Image
          src={LOGIN_IMAGE.src}
          alt={LOGIN_IMAGE.alt}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-16 left-16 max-w-lg text-white">

          <p className="tracking-[0.3em] text-sm mb-6">

            ✦ {LOGIN_TESTIMONIAL.label}

          </p>

          <h2 className="text-5xl font-semibold leading-tight mb-6">

            {LOGIN_TESTIMONIAL.quote}

          </h2>

          <p className="text-xl text-gray-200 leading-relaxed">

            {
              LOGIN_TESTIMONIAL.description
            }

          </p>
        </div>
      </div>
    </section>
  );
}