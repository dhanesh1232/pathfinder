export default function Testimonial() {
  return (
    <section className="w-full py-32 bg-transparent flex items-center justify-center px-6">
      <div className="max-w-4xl text-center flex flex-col items-center gap-10">
        <div className="text-pathfinder-green text-6xl font-serif">"</div>
        <p className="text-white text-2xl md:text-4xl font-playfair leading-relaxed">
          The team at Pathfinder didn't just build a website; they forged an
          identity that resonates with our core values. A truly transformative
          experience.
        </p>
        <div className="flex flex-col items-center gap-2">
          <cite className="text-white font-medium not-italic">Jane Doe</cite>
          <span className="text-white/50 text-sm">CEO, Future Corp</span>
        </div>
      </div>
    </section>
  );
}
