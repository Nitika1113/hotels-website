import { LoginFormData } from "../../../types/auth";

export const LOGIN_PAGE_TEXT = {
  heading: "Welcome Back",
  subheading:
    "Sign in to access your exclusive concierge services and upcoming stays.",

  submitButton: "Sign In",

  registerPrompt: "Don't have an account?",

  registerLinkLabel: "Create Account",

  registerHref: "/register",

  dividerText: "OR CONTINUE WITH",

  forgotPassword: "Forgot Password?",

  forgotPasswordHref: "/forgot-password",   
  
  keepSign :"By continuing, I agree to the Terms & Privacy Policy",
};

export const LOGIN_FIELDS: {
  name: keyof LoginFormData;
  label: string;
  placeholder: string;
  type: string;
}[] = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "concierge@luxestay.com",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    type: "password",
  },
];

export const LOGIN_IMAGE = {
  src: "/images/common/login.jpg",
  alt: "Luxury Hotel Lobby",
};

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

export const LOGIN_TESTIMONIAL = {
  quote: "Elevate your travel experience.",

  description:
    "LuxeStay members enjoy complimentary upgrades, 24/7 concierge assistance, and early access to bespoke travel experiences worldwide.",

  label: "PRIVATE MEMBER ACCESS",
};