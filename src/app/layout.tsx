
import "./globals.css";

import localFont from "next/font/local";
import { Bodoni_Moda } from "next/font/google";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";


import { ReactNode } from "react";

export const metadata = {
  title: "Dream Stay",

  description: "An easy and cozy way to find the best",
};

const avenirLight = localFont({
  src: "../../public/fonts/Avenir-Light.ttf",

  weight: "300",

  style: "normal",

  display: "swap",

  variable: "--font-avenir-light",
});

const avenirRoman = localFont({
  src: "../../public/fonts/Avenir-Roman.ttf",

  weight: "400",

  style: "normal",

  display: "swap",

  variable: "--font-avenir-regular",
});

const avenirMedium = localFont({
  src: "../../public/fonts/Avenir-Medium.ttf",

  weight: "500",

  style: "normal",

  display: "swap",

  variable: "--font-avenir-medium",
});

const avenirHeavy = localFont({
  src: "../../public/fonts/Avenir-Heavy.ttf",

  weight: "700",

  style: "normal",

  display: "swap",

  variable: "--font-avenir-heavy",
});

const avenirBlack = localFont({
  src: "../../public/fonts/Avenir-Black.ttf",

  weight: "800",

  style: "normal",

  display: "swap",

  variable: "--font-avenir-black",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],

  weight: ["400", "500", "600", "700"],

  variable: "--font-bodoni",

  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${avenirLight.variable}
          ${avenirRoman.variable}
          ${avenirMedium.variable}
          ${avenirHeavy.variable}
          ${avenirBlack.variable}
          ${bodoni.variable}
          antialiased
        `}
      >
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}