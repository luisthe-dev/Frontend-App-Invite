"use client";

import { AlertCircle, RotateCw, Home, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center">
        
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction Unsuccessful</h1>
        <p className="text-gray-500 text-sm mb-6">
            Don't worry, your payment wasn't processed
        </p>

        {/* Info Box */}
        <div className="bg-gray-50 rounded-xl p-4 text-left mb-8 flex gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
                We encountered an issue while processing your payment. This could be due to insufficient funds, network issues, or card restrictions.
            </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-8">
            <button className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <RotateCw className="w-4 h-4" />
                Retry Payment
            </button>
            <Link href="/" className="w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Return Home
            </Link>
        </div>

        {/* Help Links */}
        <div className="border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600 mb-3">Need help with your transaction?</p>
            <div className="flex items-center justify-center gap-6">
                <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700">
                    <MessageCircle className="w-4 h-4" /> Contact Support
                </a>
                <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700">
                    <HelpCircle className="w-4 h-4" /> FAQ
                </a>
            </div>
            <div className="mt-6 text-[10px] text-gray-400">
                Error Reference: TXN-25041-8794<br/>
                April 21, 2025 • 14:32 GMT
            </div>
        </div>

      </div>
    </div>
  );
}
