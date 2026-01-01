import { Users, Zap, Headphones } from "lucide-react";
import Image from "next/image";

// Ideally we'd have an image for this.
// I will just use a placeholder text div for now if no image is available.

export default function HostBenefits() {
  return (
    <section className="py-16 bg-violet-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm">
            
            <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Host Benefits</h2>
                
                <div className="space-y-8">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Reach More People</h3>
                            <p className="text-gray-500 mt-1">Connect with thousands of potential attendees interested in your events.</p>
                        </div>
                    </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Professional Tools</h3>
                            <p className="text-gray-500 mt-1">Access premium features for ticketing, promotion, and attendee management.</p>
                        </div>
                    </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
                            <Headphones className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">24/7 Support</h3>
                            <p className="text-gray-500 mt-1">Our help center is available for you and your dedicated support team.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <button className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200">
                        Host an Event
                    </button>
                </div>
            </div>

            <div className="md:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                {/* Placeholder for the party image in the screenshot */}
                 <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-2xl">
                    Host Image
                 </div>
            </div>

        </div>
      </div>
    </section>
  );
}
