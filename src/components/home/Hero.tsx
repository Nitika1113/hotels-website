import { HOME_HERO } from "./config";
import HeroSearch from "./HeroSearch";

export default function Hero() {
  return (
    <section
      className="
        relative
        h-screen
        bg-[url('https://res.cloudinary.com/dfdvk4qh5/image/upload/v1779796043/home_kzs0xc.jpg')]
        bg-cover
        bg-center
        flex
        items-center
        justify-center
        text-white
        text-center
      "
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <div className="relative z-10 px-6">

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {HOME_HERO.heading}
        </h1>

        <p className="text-lg md:text-2xl max-w-2xl mx-auto">
          {HOME_HERO.subheading}
        </p>
        <HeroSearch />
      </div>
    </section>
  );
}