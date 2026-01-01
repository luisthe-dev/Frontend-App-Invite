"use client";

import { useRouter } from 'next/navigation';
import { 
  Music, Briefcase, Coffee, Palette, Trophy, Cpu, Heart, Globe 
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Music', icon: Music, color: 'bg-pink-50 text-pink-600' },
  { name: 'Business', icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
  { name: 'Food & Drink', icon: Coffee, color: 'bg-orange-50 text-orange-600' },
  { name: 'Arts', icon: Palette, color: 'bg-purple-50 text-purple-600' },
  { name: 'Sports', icon: Trophy, color: 'bg-green-50 text-green-600' },
  { name: 'Technology', icon: Cpu, color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Wellness', icon: Heart, color: 'bg-teal-50 text-teal-600' },
  { name: 'All', icon: Globe, color: 'bg-gray-50 text-gray-600' },
];

export default function Categories() {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
        router.push('/events');
    } else {
        router.push(`/events?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-violet-100 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-violet-600">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
