import Link from "next/link";

export default function JoinJourney() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto bg-violet-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
         {/* Decorative circles */}
         <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Join Our Journey</h2>
            <p className="text-violet-100 text-lg mb-10 max-w-2xl mx-auto">
                We're building something special, and we'd love for you to be part of it. Whether as a customer, partner, or team member, there's a spot for you in our story.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto px-8 py-3 bg-white text-violet-600 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                    Get Started
                </Link>
                <Link href="/contact" className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                    Contact Us
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
