import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-500">Last updated: {lastUpdated}</p>
          </div>
          
          <div className="prose prose-violet max-w-none text-gray-600">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
