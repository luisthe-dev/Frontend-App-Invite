import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import MissionVision from "@/components/about/MissionVision";
import CoreValues from "@/components/about/CoreValues";
import JoinJourney from "@/components/about/JoinJourney";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - MyInvite",
  description: "Learn about our mission to revolutionize event discovery.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <AboutHero />
      <MissionVision />
      <CoreValues />
      <JoinJourney />
      <Footer />
    </main>
  );
}
