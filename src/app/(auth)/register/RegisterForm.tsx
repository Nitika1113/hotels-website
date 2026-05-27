"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

import { registerSchema } from "@/lib/validations/auth.schema";

import { RegisterFormData } from "@/types/auth";

import {
  REGISTER_PAGE_TEXT,
  REGISTER_FIELDS,
  SOCIAL_PROVIDERS,
  REGISTER_IMAGE,
  REGISTER_TESTIMONIAL,
} from "@/app/(auth)/register/register.config";

export default function RegisterForm() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver:
      zodResolver(registerSchema),
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {

    try {

      setLoading(true);

      const response = await fetch(
        "/api/register",
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

      alert(
        "Registration Successful"
      );

      router.push("/login");

      router.refresh();

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen overflow-hidden grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="bg-[#f8f8f8] flex flex-col">

        <div className="flex-1 flex items-center px-18 py-5">

          <div className="w-full mt-2 max-w-xl">

            <h2 className="text-5xl font-bodoni font-bold mb-4">

              {REGISTER_PAGE_TEXT.heading}

            </h2>

            <p className="text-gray-500 text-lg mb-5">

              {REGISTER_PAGE_TEXT.subheading}

            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {REGISTER_FIELDS.map((field) => (

                <div key={field.name}>

                  <div className="relative">

                    <Input
                      type={
                        field.name === "password" &&
                        showPassword
                          ? "text"
                          : field.type
                      }
                      label={field.label}
                      placeholder={field.placeholder}
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
                        className="absolute right-4 top-[58%] -translate-y-1/2 text-gray-500"
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

                <div className="flex items-start gap-2 text-sm">

                  <input
                    type="checkbox"
                    className="mt-1"
                    {...register("terms")}
                  />

                  <p className="text-gray-600">

                    {
                      REGISTER_PAGE_TEXT.termsText
                    }{" "}

                    <Link
                      href={
                        REGISTER_PAGE_TEXT.termsHref
                      }
                      className="underline"
                    >

                      {
                        REGISTER_PAGE_TEXT.termsLinkLabel
                      }

                    </Link>{" "}

                    and{" "}

                    <Link
                      href={
                        REGISTER_PAGE_TEXT.privacyHref
                      }
                      className="underline"
                    >

                      {
                        REGISTER_PAGE_TEXT.privacyLinkLabel
                      }

                    </Link>
                  </p>
                </div>

                {errors.terms && (

                  <p className="text-red-500 text-sm mt-2">

                    {
                      errors.terms.message
                    }

                  </p>
                )}
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2"
              >

                {loading
                  ? "Creating Account..."
                  : REGISTER_PAGE_TEXT.submitButton}

                {!loading && (
                  <ArrowRight size={20} />
                )}

              </Button>
            </form>

            {/* LOGIN */}
            <p className="text-center mt-5 text-gray-600">

              {
                REGISTER_PAGE_TEXT.loginPrompt
              }{" "}

              <Link
                href={
                  REGISTER_PAGE_TEXT.loginHref
                }
                className="font-semibold text-black"
              >

                {
                  REGISTER_PAGE_TEXT.loginLinkLabel
                }

              </Link>
            </p>

            {/* SOCIAL */}
            <div className="mt-5">

              <div className="flex items-center gap-4">

                <div className="h-0.5 bg-gray-300 flex-1" />

                <span className="text-gray-400 text-md">

                  {
                    REGISTER_PAGE_TEXT.dividerText
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
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative hidden lg:block">

        <Image
          src={REGISTER_IMAGE.src}
          alt={REGISTER_IMAGE.alt}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-10 left-16 text-white max-w-lg">

          <p className="text-yellow-400 text-4xl mb-4">

            {"★".repeat(
              REGISTER_TESTIMONIAL.stars
            )}

          </p>

          <h2 className="text-4xl max-w-120 font-semibold">

            &ldquo;
            {
              REGISTER_TESTIMONIAL.quote
            }
            &rdquo;

          </h2>

          <p className="mt-8 text-lg text-gray-200">

            —
            {
              REGISTER_TESTIMONIAL.author
            },{" "}
            {
              REGISTER_TESTIMONIAL.role
            }

          </p>
        </div>
      </div>
    </section>
  );
}