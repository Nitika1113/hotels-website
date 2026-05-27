
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-[#f8f8f8] py-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm p-8 md:p-14">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Privacy Policy
        </h1>

        <p className="text-gray-600 leading-8 mb-8">
          Your privacy is important to us. This Privacy Policy explains
          how we collect, use, and protect your personal information.
        </p>

        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>

            <p className="text-gray-600 leading-8">
              We may collect personal information such as your name,
              email address, phone number, and booking details.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Information
            </h2>

            <p className="text-gray-600 leading-8">
              Your information is used to improve our services,
              process bookings, provide customer support, and send
              important updates.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              3. Data Protection
            </h2>

            <p className="text-gray-600 leading-8">
              We implement security measures to protect your personal
              data against unauthorized access or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              4. Third-Party Services
            </h2>

            <p className="text-gray-600 leading-8">
              We may use trusted third-party services for payments,
              analytics, and communication. These providers are required
              to keep your information secure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              5. Updates to Privacy Policy
            </h2>

            <p className="text-gray-600 leading-8">
              We may update this Privacy Policy occasionally.
              Continued use of our services indicates acceptance of
              these updates.
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
