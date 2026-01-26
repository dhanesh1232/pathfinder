export default function Services() {
  return (
    <section
      id="service"
      className="w-full py-40 bg-transparent flex flex-col items-center justify-center px-6"
    >
      <div className="max-w-4xl text-center">
        <h2 className="text-white font-playfair text-5xl md:text-7xl mb-12">
          We craft <span className="text-zinc-600">digital legacies.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {["Strategy", "Design", "Development"].map((service) => (
            <div
              key={service}
              className="flex flex-col gap-4 text-left border-t border-white/20 pt-6 hover:border-pathfinder-green transition-colors duration-500 group"
            >
              <h3 className="text-2xl text-white font-medium group-hover:text-pathfinder-green transition-colors">
                {service}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
