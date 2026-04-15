"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";

export function CookiePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookie-consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set("cookie-consent", "accepted", { expires: 365 });
    setShowPopup(false);
  };

  const declineCookies = () => {
    Cookies.set("cookie-consent", "declined", { expires: 365 });
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[100] bg-background border shadow-lg rounded-xl p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Cookie Consent</h3>
            </div>
            <button
              onClick={declineCookies}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.{' '}
            <Link href="/privacy-policy" className="text-primary hover:underline font-medium">
              Read more
            </Link>
          </p>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={declineCookies}
              className="w-full md:w-auto"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={acceptCookies}
              className="w-full md:w-auto"
            >
              Accept All
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
