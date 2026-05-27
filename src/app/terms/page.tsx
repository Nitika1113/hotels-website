
import Link from "next/link";

export default function TermsPage() {
  return (
    <section className="min-h-screen bg-[#f8f8f8] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-14">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Terms of Service
        </h1>

        <p className="text-gray-600 leading-8 mb-8">
          Welcome to our platform. By accessing or using our website,
          you agree to comply with and be bound by these Terms of Service.
          Please read them carefully before using our services.
        </p>

        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>

            <p className="text-gray-600 leading-8">
              By creating an account or using our services, you agree to
              these terms and conditions. If you do not agree, please do
              not use our platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              2. User Responsibilities
            </h2>

            <p className="text-gray-600 leading-8">
              Users are responsible for maintaining the confidentiality
              of their accounts and passwords. Any activity performed
              through your account is your responsibility.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              3. Bookings & Payments
            </h2>

            <p className="text-gray-600 leading-8">
              All bookings and payments made through the platform are
              subject to availability and confirmation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              4. Prohibited Activities
            </h2>

            <p className="text-gray-600 leading-8">
              Users must not misuse the platform, attempt unauthorized
              access, distribute harmful content, or violate any laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              5. Changes to Terms
            </h2>

            <p className="text-gray-600 leading-8">
              We reserve the right to modify these terms at any time.
              Continued use of the platform after updates means you
              accept the revised terms.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 h-12 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}


