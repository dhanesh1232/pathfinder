export default function Portfolio() {
  return (
    <section className="w-full py-40 bg-transparent px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white font-playfair text-4xl md:text-5xl mb-20 text-center">
          Selected Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="group relative aspect-4/3 bg-zinc-900 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-500"></div>
              {/* Placeholder for project image */}
              <div className="absolute inset-0 flex items-center justify-center text-white/20 text-4xl font-playfair">
                Project {item}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-linear-to-t from-black/80 to-transparent">
                <h3 className="text-white text-2xl font-playfair">
                  Project Name
                </h3>
                <p className="text-pathfinder-green text-sm uppercase tracking-wider mt-2">
                  Brand Identity
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
