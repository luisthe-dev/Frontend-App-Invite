import { Music, Smile, Briefcase, Trophy, Theater, UtensilsCrossed, Wrench, CalendarDays, Users } from "lucide-react";

// Lucide doesn't have all exact matches, using closest approximations
const CATEGORIES = [
  { id: "music", name: "Music", subtitle: "Concerts, Festivals & More", icon: Music, color: "bg-fuchsia-600" },
  { id: "comedy", name: "Comedy", subtitle: "Stand-up, Improv & Shows", icon: Smile, color: "bg-orange-500" },
  { id: "conferences", name: "Conferences", subtitle: "Business & Professional Events", icon: Briefcase, color: "bg-blue-600" },
  { id: "sports", name: "Sports", subtitle: "Games, Tournaments & Matches", icon: Trophy, color: "bg-indigo-600" },
  { id: "arts", name: "Arts & Theater", subtitle: "Plays, Musicals & Exhibitions", icon: Theater, color: "bg-pink-600" },
  { id: "food", name: "Food & Drink", subtitle: "Tastings, Festivals & Dinners", icon: UtensilsCrossed, color: "bg-yellow-500" },
  { id: "workshops", name: "Workshops", subtitle: "Classes, Seminars & Training", icon: Wrench, color: "bg-emerald-600" },
  { id: "festivals", name: "Festivals", subtitle: "Cultural & Seasonal Celebrations", icon: CalendarDays, color: "bg-red-500" },
  { id: "networking", name: "Networking", subtitle: "Meetups, Mixers & Social Events", icon: Users, color: "bg-cyan-600" },
];

export default function CategoryGrid() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image Placeholder / Gradient */}
            <div className={`absolute inset-0 ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
            
            {/* Dark Overlay for text readability if we had real images */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

             {/* Background Image (CSS Gradient representation) */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-900/80 pointer-events-none" />


            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
              <div className={`w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center mb-3 bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-colors`}>
                <cat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:scale-105 transition-transform">{cat.name}</h3>
              <p className="text-gray-300 text-xs font-medium tracking-wide">{cat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
