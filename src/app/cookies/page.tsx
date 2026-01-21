import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Cookie, MousePointer2, BarChart3, ShieldCheck } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-violet-900 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-violet-100 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
            <Cookie className="w-4 h-4" />
            <span>Cookies & Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-violet-100 text-lg max-w-2xl mx-auto leading-relaxed">
            We use cookies to improve your experience. Here&apos;s exactly how
            and why.
          </p>
        </div>
      </div>

      <main className="flex-grow -mt-12 pb-20 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Header Bar */}
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>
                Effective Date: <strong>January 14, 2026</strong>
              </span>
              <span className="hidden sm:inline-block">Read time: ~4 mins</span>
            </div>

            <div className="p-8 md:p-12">
              <div className="prose prose-lg prose-violet max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-violet-600 prose-a:no-underline hover:prose-a:text-violet-700">
                <p className="text-xl text-gray-700 leading-relaxed font-medium mb-8">
                  MyInvite uses cookies and similar technologies to improve your
                  experience on our Platform. This Cookie Policy explains what
                  cookies are, how we use them, and your choices regarding their
                  use.
                </p>

                <div className="my-10 grid gap-4 sm:grid-cols-2">
                  <div className="p-5 bg-violet-50 rounded-xl border border-violet-100 flex items-start gap-4">
                    <ShieldCheck className="w-6 h-6 text-violet-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-violet-900 font-bold m-0 mb-1">
                        Essential
                      </h4>
                      <p className="text-sm text-violet-800 m-0">
                        Required for login and shopping cart.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 bg-violet-50 rounded-xl border border-violet-100 flex items-start gap-4">
                    <MousePointer2 className="w-6 h-6 text-violet-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-violet-900 font-bold m-0 mb-1">
                        Functionality
                      </h4>
                      <p className="text-sm text-violet-800 m-0">
                        Remembers your preferences.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 bg-violet-50 rounded-xl border border-violet-100 flex items-start gap-4">
                    <BarChart3 className="w-6 h-6 text-violet-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-violet-900 font-bold m-0 mb-1">
                        Analytics
                      </h4>
                      <p className="text-sm text-violet-800 m-0">
                        Helps us improve our features.
                      </p>
                    </div>
                  </div>
                  <div className="p-5 bg-violet-50 rounded-xl border border-violet-100 flex items-start gap-4">
                    <Cookie className="w-6 h-6 text-violet-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-violet-900 font-bold m-0 mb-1">
                        Targeting
                      </h4>
                      <p className="text-sm text-violet-800 m-0">
                        Relevant ads and content.
                      </p>
                    </div>
                  </div>
                </div>

                <h3>1. What are Cookies?</h3>
                <p>
                  Cookies are small text files that are placed on your device
                  (computer, smartphone, or tablet) when you visit a website.
                  They are widely used to make websites work more efficiently
                  and to provide information to the site owners.
                </p>

                <h3>2. How We Use Cookies</h3>
                <p>We use cookies for the following purposes:</p>
                <ul>
                  <li>
                    <strong>Essential Cookies:</strong> These are necessary for
                    the Platform to function correctly. They include cookies
                    that allow you to log in to secure areas, use the shopping
                    cart, or make e-billing services available.
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> These allow the
                    Platform to remember choices you make (such as your
                    username, language, or region) and provide enhanced, more
                    personal features.
                  </li>
                  <li>
                    <strong>Performance and Analytics Cookies:</strong> These
                    cookies collect information about how visitors use our
                    Platform, such as which pages are visited most often. We use
                    this information to improve the performance of our website.
                  </li>
                  <li>
                    <strong>Targeting Cookies:</strong> These cookies report on
                    your browsing habits and may be used to deliver advertising
                    that is relevant to your interests.
                  </li>
                </ul>

                <h3>3. Third-Party Cookies</h3>
                <p>
                  In addition to our own cookies, we may also use various
                  third-party cookies to report usage statistics of the
                  Platform, deliver advertisements on and through the Platform,
                  and so on. For example, we use Google Analytics to help us
                  understand how our website is used.
                </p>

                <h3>4. Managing Cookies</h3>
                <p>
                  Most web browsers allow you to control cookies through their
                  settings preferences. However, if you limit the ability of
                  websites to set cookies, you may worsen your overall user
                  experience, since it will no longer be personalized to you. It
                  may also stop you from saving customized settings like login
                  information.
                </p>
                <p>
                  To learn more about cookies, including how to see what cookies
                  have been set and how to manage and delete them, visit{" "}
                  <a
                    href="https://www.allaboutcookies.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.allaboutcookies.org
                  </a>
                  .
                </p>

                <h3>5. Contact Us</h3>
                <p>
                  If you have any questions about our use of cookies, please
                  contact us at{" "}
                  <a href="mailto:support@myinvite.ng">support@myinvite.ng</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
