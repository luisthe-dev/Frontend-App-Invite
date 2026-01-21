import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Lock, Eye, Cloud } from "lucide-react";

export default function PrivacyPage() {
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
            <Lock className="w-4 h-4" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-violet-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Transparent, secure, and focused on you. See how we handle your
            personal data.
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
              <span className="hidden sm:inline-block">Read time: ~6 mins</span>
            </div>

            <div className="p-8 md:p-12">
              <div className="prose prose-lg prose-violet max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-violet-600 prose-a:no-underline hover:prose-a:text-violet-700">
                <p className="text-xl text-gray-700 leading-relaxed font-medium mb-8">
                  At MyInvite, we take your privacy seriously. This Privacy
                  Policy explains how we collect, use, and share your personal
                  information when you use our Platform. By using MyInvite, you
                  consent to the practices described in this policy.
                </p>

                <div className="my-10 grid sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-violet-50 rounded-xl border border-violet-100 text-center">
                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h4 className="text-violet-900 font-bold mb-1">
                      Transparency
                    </h4>
                    <p className="text-sm text-violet-700 m-0">
                      We never sell your data.
                    </p>
                  </div>
                  <div className="p-6 bg-violet-50 rounded-xl border border-violet-100 text-center">
                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h4 className="text-violet-900 font-bold mb-1">Security</h4>
                    <p className="text-sm text-violet-700 m-0">
                      Bank-grade encryption.
                    </p>
                  </div>
                  <div className="p-6 bg-violet-50 rounded-xl border border-violet-100 text-center">
                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <h4 className="text-violet-900 font-bold mb-1">Control</h4>
                    <p className="text-sm text-violet-700 m-0">
                      Manage your own data.
                    </p>
                  </div>
                </div>

                <h3>1. Information We Collect</h3>
                <p>
                  We collect information you provide directly to us, such as
                  when you create an account, create an event, purchase a
                  ticket, or contact support. This may include:
                </p>
                <ul>
                  <li>
                    <strong>Personal Information:</strong> Name, email address,
                    phone number.
                  </li>
                  <li>
                    <strong>Identity Information:</strong> For Hosts, we may
                    collect KYC documents (e.g., BVN, NIN, Passport) for
                    verification purposes.
                  </li>
                  <li>
                    <strong>Payment Information:</strong> We do not store full
                    credit card numbers. Payment transactions are processed by
                    third-party providers.
                  </li>
                  <li>
                    <strong>Event Information:</strong> Details about events you
                    create or attend.
                  </li>
                </ul>

                <h3>2. How We Use Your Information</h3>
                <p>We use your information to:</p>
                <ul>
                  <li>Provide, maintain, and improve our Platform.</li>
                  <li>
                    Process transactions and send related information (e.g.,
                    tickets, receipts).
                  </li>
                  <li>Verify your identity and prevent fraud.</li>
                  <li>
                    Send you technical notices, updates, and support messages.
                  </li>
                </ul>

                <h3>3. Sharing of Information</h3>
                <p>
                  We do not sell your personal information. We may share your
                  information with:
                </p>
                <ul>
                  <li>
                    <strong>Event Hosts:</strong> When you register for an
                    event, we share your name and email with the Host so they
                    can manage the event.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> We use third-party
                    vendors for payment processing (Paystack), email delivery,
                    and hosting services.
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> We may disclose
                    information if required by law.
                  </li>
                </ul>

                <h3>4. Data Retention</h3>
                <p>
                  We retain your information for as long as your account is
                  active or as needed to provide you services. We may also
                  retain data to comply with legal obligations, resolve
                  disputes, and enforce our agreements.
                </p>

                <h3>5. Your Rights</h3>
                <p>
                  Depending on your location, you may have rights regarding your
                  personal data, including the right to access, correct, or
                  delete your information. You can manage your account settings
                  directly in the app or contact us for assistance.
                </p>

                <h3>6. Security</h3>
                <p>
                  We implement reasonable security measures to protect your
                  information from unauthorized access, alteration, or
                  destruction. However, no method of transmission over the
                  internet is completely secure.
                </p>

                <h3>7. Children's Privacy</h3>
                <p>
                  Our Platform is not intended for children under the age of 13.
                  We do not knowingly collect personal information from
                  children.
                </p>

                <h3>8. Changes to this Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new policy on this
                  page.
                </p>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-gray-900 mt-0">Questions?</h3>
                  <p>
                    If you have any questions about this Privacy Policy, please
                    contact our data protection officer at{" "}
                    <a
                      href="mailto:privacy@myinvite.ng"
                      className="text-emerald-600 font-semibold hover:text-emerald-700"
                    >
                      privacy@myinvite.ng
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
