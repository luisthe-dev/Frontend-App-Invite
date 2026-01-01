import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";

import FeaturedEvents from "@/components/home/FeaturedEvents";
import Categories from "@/components/home/Categories";
import Newsletter from "@/components/home/Newsletter";
import HostBenefits from "@/components/home/HostBenefits";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <FeaturedEvents />
      <Categories />
      <Newsletter />
      <HostBenefits />
      <Footer />
    </main>
  );
}

