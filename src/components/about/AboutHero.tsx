export default function AboutHero() {
  return (
    <section className="bg-violet-50 pt-32 pb-20 text-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Our Story
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We're revolutionizing the way people discover, book, and experience events around the world.
        </p>
        
        {/* Simple chevron down indicator */}
        <div className="mt-12 animate-bounce">
            <svg className="w-6 h-6 text-violet-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>
      </div>
    </section>
  );
}
