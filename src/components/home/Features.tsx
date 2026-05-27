import { HOME_FEATURES } from "./config";

export default function Features() {
  return (
    <section className="py-24 bg-[#f7f7f7]">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-16">
          World-Class Refinement
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          {HOME_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="
                bg-white
                rounded-2xl
                p-8
                shadow-sm
                text-center
              "
            >
              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}