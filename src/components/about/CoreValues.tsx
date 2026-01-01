import { Heart, Lightbulb, ShieldCheck, Globe, Users2, Leaf } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Event-First",
    description: "We design with events in mind, ensuring every feature enhances the experience for organizers and attendees. From layout planning to entry, we make every step seamless.",
    color: "bg-pink-100 text-pink-600"
  },
  {
    icon: Lightbulb,
    title: "Continuous Innovation",
    description: "We embrace change and constantly seek better solutions. We're passionate about pushing boundaries and finding smarter, more elegant ways to solve problems.",
    color: "bg-violet-100 text-violet-600"
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description: "We believe in being open about how we work, what we're building, and why. Trust is the foundation of meaningful relationships with our users and partners.",
    color: "bg-blue-100 text-blue-600"
  },
   {
    icon: Globe,
    title: "Inclusivity",
    description: "We create tools that work for everyone, regardless of background, ability, or circumstance. Diversity of thought and experience makes our solutions stronger.",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Users2,
    title: "Collaboration",
    description: "We believe the best ideas emerge when people work together in an open environment. Where diverse perspectives can combine to create something greater than the sum of their parts.",
    color: "bg-fuchsia-100 text-fuchsia-600"
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "We're committed to building a company and products that have a positive long-term impact on society and the environment. We think in decades, not quarters.",
    color: "bg-emerald-100 text-emerald-600"
  }
];

export default function CoreValues() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-violet-600 mb-4">Our Core Values</h2>
            <p className="text-gray-500">
                These principles guide everything we do, from product development to customer service.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VALUES.map((val, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${val.color}`}>
                        <val.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">
                        {val.description}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
