import { CheckCircle2 } from "lucide-react";

export default function MissionVision() {
  return (
    <div className="py-20 overflow-hidden">
      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-violet-600 mb-6">Our Mission</h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                At MyInvite, we believe that great events have the power to bring people together and create unforgettable memories. Our mission is to build an intuitive, accessible platform that connects event organizers with their perfect audience.
              </p>
              <p>
                We're committed to making event discovery and ticketing seamless, secure, and delightful. From intimate local gatherings to major international festivals, we provide the tools and technology to make every event a success.
              </p>
              <p>
                Every feature we develop, from real-time seat selection to dynamic pricing, is designed to enhance the event experience for both organizers and attendees. We're not just selling tickets – we're creating connections and memories that last a lifetime.
              </p>
            </div>
          </div>
          <div className="md:w-1/2">
             <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] w-full bg-slate-200">
                {/* Placeholder for Concert Crowd Image */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-violet-900 to-fuchsia-800 flex items-center justify-center text-white/50 font-bold text-2xl">
                    Mission Image (Crowd)
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
           <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-violet-600 mb-6">Our Vision</h2>
             <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-8">
              <p>
                We envision a world where discovering and attending events is effortless and exciting. A future where every event finds its perfect audience and every person can easily discover experiences that match their interests and passions.
              </p>
            </div>
            
            <ul className="space-y-4 mb-8">
                {["Providing seamless ticketing solutions for events of all sizes", 
                  "Connecting event organizers with their target audiences worldwide", 
                  "Making event discovery personalized and accessible to everyone"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-violet-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                    </li>
                ))}
            </ul>

            <p className="text-gray-600 italic">
                By 2030, we aim to be the world's leading event ticketing platform, powering millions of events annually and setting new standards for how people discover and experience live entertainment.
            </p>

          </div>
          <div className="md:w-1/2">
             <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[400px] w-full bg-slate-200">
                {/* Placeholder for Indoor Event Image */}
                  <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900 to-purple-800 flex items-center justify-center text-white/50 font-bold text-2xl">
                    Vision Image (Indoor)
                 </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
