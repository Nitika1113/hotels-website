import {
  HOME_FEATURES,
  HOME_FEATURES_SECTION,
} from "./config";

export default function Features() {
  return (
    <section className="bg-[#faf8f5] py-16">
      <div className="mx-auto max-w-7xl px-5">
        {/* HEADER */}

<div className="mb-12 flex flex-col items-center gap-6 mx-auto max-w-4xl">

  <div className="flex flex-col items-center text-center">
    <span
      className="
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        border-black/10
        bg-white
        px-4
        py-2
        text-[11px]
        font-semibold
        uppercase
        tracking-[0.25em]
        text-[#8b6b45]
      "
    >
      {HOME_FEATURES_SECTION.badge}
    </span>

    <h2
      className="
        mt-4
        text-3xl
        font-semibold
        tracking-tight
        text-[#1f1f1f]
        md:text-5xl
      "
    >
      {HOME_FEATURES_SECTION.heading}
    </h2>

    <p
      className="
        mt-4
        max-w-4xl
        text-base
        leading-relaxed
        text-gray-500
      "
    >
      {HOME_FEATURES_SECTION.description}
    </p>
  </div>
</div>


        {/* FEATURES */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {HOME_FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-black/5
                  bg-white
                  p-8
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]
                "
              >
                {/* LIGHT GLOW */}
                <div
                  className="
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-[#c29b6a]/10
                    blur-3xl
                  "
                />

                {/* ICON */}
                <div
                  className="
                    relative
                    z-10
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#faf7f2]
                    text-[#8b6b45]
                    transition-all
                    duration-300
                    group-hover:bg-[#c29b6a]
                    group-hover:text-white
                  "
                >
                  <Icon size={24} />
                </div>

                {/* CONTENT */}
                <div className="relative z-10 mt-6">
                  <h3
                    className="
                      text-2xl
                      font-semibold
                      tracking-tight
                      text-[#1f1f1f]
                    "
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      mt-3
                      text-base
                      leading-relaxed
                      text-gray-500
                    "
                  >
                    {feature.description}
                  </p>
                </div>

                {/* BOTTOM ACCENT */}
                <div
                  className="
                    relative
                    z-10
                    mt-8
                    h-px
                    w-full
                    bg-linear-to-r
                    from-[#c29b6a]
                    to-transparent
                  "
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}