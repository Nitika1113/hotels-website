
import { RegisterFormData } from "../../../types/auth";

// PAGE TEXT 
export const REGISTER_PAGE_TEXT = {
  heading: "Create your account",
  subheading:
    "Join our exclusive community of travelers and access curated stays worldwide.",
  submitButton: "Create Account",
  loginPrompt: "Already have an account?",
  loginLinkLabel: "Sign In",
  loginHref: "/login",
  dividerText: "OR CONTINUE WITH",
  termsText: "I agree to the",
  termsLinkLabel: "Terms of Service",
  termsHref: "/terms",
  privacyLinkLabel: "Privacy Policy",
  privacyHref: "/privacy",
};

// FORM FIELDS 
// Add, remove, or reorder fields
// "name" must match a key in RegisterFormData type.
export const REGISTER_FIELDS: {
  name: keyof RegisterFormData;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "John Doe",
    type: "text",
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "john@example.com",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    type: "password",
  },
];

// SOCIAL LOGIN BUTTONS
// Add more providers here (Facebook, GitHub, etc.)
export const SOCIAL_PROVIDERS = [
  {
    id: "google",
    label: "Google",
    icon: "/icons/google.png",
  },
  {
    id: "apple",
    label: "Apple",
    icon: "/icons/apple.png",
  },
  {
    id:"facebook",
    label:"Facebook",
    icon:"/icons/facebook.png"
  }
];

// RIGHT SIDE IMAGE 
export const REGISTER_IMAGE = {
  src: "/images/common/register.jpg",
  alt: "Luxury Hotel",
};

// TESTIMONIAL
export const REGISTER_TESTIMONIAL = {
  stars: 5,
  quote:
    "The most seamless booking experience I've ever had for Dream Stay.",
  author: "Rohan Rai",
  role: "Concierge Member",
};
