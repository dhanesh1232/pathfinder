export default function Footer() {
  return (
    <section
      id="contact"
      className="w-full py-32 bg-transparent border-t border-white/10 flex flex-col items-center justify-center px-6"
    >
      <div className="max-w-4xl text-center flex flex-col items-center gap-12">
        <h2 className="text-white font-playfair text-5xl md:text-7xl">
          Let's start the <br />
          <span className="text-pathfinder-green">journey.</span>
        </h2>

        <button className="px-12 py-4 bg-white text-black font-medium tracking-wide rounded-full hover:bg-pathfinder-green hover:text-white transition-colors duration-300">
          Get in Touch
        </button>

        <div className="flex gap-8 mt-12 text-white/40 text-sm">
          <a href="#" className="hover:text-white transition-colors">
            LinkedIn
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
        </div>

        <div className="mt-20 text-white/20 text-xs uppercase tracking-widest">
          © 2026 Pathfinder. All rights reserved.
        </div>
      </div>
    </section>
  );
}
