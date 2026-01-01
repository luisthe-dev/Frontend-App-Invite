import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";

interface EventCardProps {
  id: string;
  slug?: string;
  title: string;
  location: string;
  date: string;
  image?: string;
  priceRange: string;
  category: string;
}

export default function EventCard({
  id,
  slug,
  title,
  location,
  date,
  image,
  priceRange,
  category
}: EventCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {/* Category Badge */}
         <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-violet-600 text-xs font-bold rounded-full uppercase tracking-wider">
            {category}
          </span>
        </div>
        
        {/* Image Placeholder or Real Image */}
        {image ? (
            // In a real app, use next/image. For now, we might expect an external URL or static import.
            // Using a simple div with background color if no image provided to avoid broken images.
             <div className="w-full h-full bg-violet-100 flex items-center justify-center text-violet-300">
                <img src={image} alt={title} className="w-full h-full object-cover" />
             </div>
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-100 to-fuchsia-100 group-hover:scale-105 transition-transform duration-500" />
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-violet-600 transition-colors">
            {title}
        </h3>
        
        <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="line-clamp-1">{location}</span>
            </div>
             <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>{date}</span>
            </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div className="text-gray-900 font-bold">
                {priceRange}
            </div>
            <Link href={`/events/${slug || id}`} className="px-4 py-2 bg-violet-50 text-violet-600 text-sm font-semibold rounded-lg hover:bg-violet-600 hover:text-white transition-all">
                Get Ticket
            </Link>
        </div>
      </div>
    </div>
  );
}
