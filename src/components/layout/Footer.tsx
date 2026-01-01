import Link from "next/link";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand */}
            <div>
                <Link href="/" className="text-2xl font-bold text-white font-serif italic mb-6 block">
                  MyInvite
                </Link>
                <p className="text-sm text-slate-400 mb-6">
                    Transforming how people discover, book, and experience events worldwide.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                </div>
            </div>

            {/* Links Columns */}
             <div>
                <h4 className="text-white font-bold mb-6">Company</h4>
                <ul className="space-y-3 text-sm">
                    <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                    <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                    <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                    <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                </ul>
            </div>

             <div>
                <h4 className="text-white font-bold mb-6">Resources</h4>
                <ul className="space-y-3 text-sm">
                    <li><Link href="/help" className="hover:text-white transition-colors">Event Guidelines</Link></li>
                    <li><Link href="/terms" className="hover:text-white transition-colors">Host Center</Link></li>
                    <li><Link href="/privacy" className="hover:text-white transition-colors">Organizer Resources</Link></li>
                    <li><Link href="/sitemap" className="hover:text-white transition-colors">Game Partners</Link></li>
                </ul>
            </div>

             <div>
                <h4 className="text-white font-bold mb-6">Legal</h4>
                <ul className="space-y-3 text-sm">
                    <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                    <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                    <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link></li>
                </ul>
            </div>

        </div>

        <div className="border-t border-slate-800 mt-8 md:mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p className="text-center md:text-left">&copy; 2025 MyInvite. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {/* Payment icons placeholder */}
                <span>Visa</span>
                <span>Mastercard</span>
                <span>PayPal</span>
                <span>Apple Pay</span>
            </div>
        </div>
      </div>
    </footer>
  );
}
