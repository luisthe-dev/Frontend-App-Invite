import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ScrollText, Shield, FileText } from "lucide-react";

export default function TermsPage() {
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
            <ScrollText className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-violet-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using our platform. They
            ensure safe and fair usage for everyone.
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
              <span className="hidden sm:inline-block">Read time: ~8 mins</span>
            </div>

            <div className="p-8 md:p-12">
              <div className="prose prose-lg prose-violet max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-gray-900 prose-p:leading-relaxed prose-a:text-violet-600 prose-a:no-underline hover:prose-a:text-violet-700">
                <p className="text-xl text-gray-700 leading-relaxed font-medium mb-8">
                  Welcome to MyInvite. These Terms of Service
                  (&quot;Terms&quot;) govern your use of the MyInvite website,
                  mobile application, and services (collectively, the
                  &quot;Platform&quot;). By accessing or using MyInvite, you
                  agree to be bound by these Terms.
                </p>

                <div className="my-10 p-6 bg-violet-50 rounded-xl border border-violet-100 flex gap-4">
                  <Shield className="w-6 h-6 text-violet-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-violet-900 font-bold m-0 mb-2">
                      Why this matters
                    </h4>
                    <p className="text-violet-700 m-0 text-sm">
                      These terms create a legal agreement between you and
                      MyInvite Inc. They define your rights and responsibilities
                      as a user.
                    </p>
                  </div>
                </div>

                <h3>1. Definitions</h3>
                <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
                  <li className="bg-gray-50 p-4 rounded-lg border border-gray-100 m-0">
                    <strong className="text-gray-900 block mb-1">
                      &quot;MyInvite&quot;
                    </strong>
                    Platform provider, &quot;we&quot;, &quot;us&quot;, or
                    &quot;our&quot;.
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg border border-gray-100 m-0">
                    <strong className="text-gray-900 block mb-1">
                      &quot;User&quot;
                    </strong>
                    Any individual or entity using the Platform.
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg border border-gray-100 m-0">
                    <strong className="text-gray-900 block mb-1">
                      &quot;Host&quot;
                    </strong>
                    User who creates events and sells tickets.
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg border border-gray-100 m-0">
                    <strong className="text-gray-900 block mb-1">
                      &quot;Attendee&quot;
                    </strong>
                    User who buys tickets or registers for events.
                  </li>
                </ul>

                <h3>2. Account Registration</h3>
                <p>
                  To access certain features, you must create an account. You
                  agree to provide accurate, current, and complete information
                  during the registration process. You are responsible for
                  safeguarding your password and for all activities that occur
                  under your account. You must notify us immediately of any
                  unauthorized use of your account.
                </p>

                <h3>3. Services for Hosts</h3>
                <p>
                  MyInvite provides a platform for Hosts to create, promote, and
                  sell tickets to events. As a Host, you represent and warrant
                  that:
                </p>
                <ul>
                  <li>You have the right and authority to hold the event.</li>
                  <li>
                    The event content does not violate any laws or third-party
                    rights.
                  </li>
                  <li>You will accurately describe the event to Attendees.</li>
                  <li>
                    You will fulfill your obligations to Attendees, including
                    holding the event at the stated time and location.
                  </li>
                </ul>
                <p>
                  MyInvite is not the organizer or owner of the events listed on
                  the Platform. We act solely as a technology provider and
                  payment facilitator.
                </p>

                <h3>4. Ticketing and Payments</h3>
                <p>
                  <strong>Fees:</strong> MyInvite charges a service fee on each
                  ticket sold. This fee may be passed on to the Attendee or
                  absorbed by the Host, as configured by the Host.
                </p>
                <p>
                  <strong>Payouts:</strong> Revenue from ticket sales (minus
                  fees) will be settled to the Host&apos;s wallet or designated
                  bank account in accordance with our payout schedule.
                </p>
                <p>
                  <strong>Refunds:</strong> Refund policies are set by the Host.
                  Attendees must request refunds directly from the Host, unless
                  the event is cancelled or deemed fraudulent by MyInvite.
                  MyInvite fees are non-refundable.
                </p>

                <h3>5. Acceptable Use</h3>
                <p>You agree not to use the Platform to:</p>
                <ul>
                  <li>Post false, misleading, or fraudulent events.</li>
                  <li>
                    Upload content that is illegal, offensive, harmful, or
                    violates rights.
                  </li>
                  <li>Interfere with the operation of the Platform.</li>
                  <li>Collect user data without consent.</li>
                </ul>

                <h3>6. Intellectual Property</h3>
                <p>
                  MyInvite retains all rights to the Platform&apos;s design,
                  code, and content. User-generated content remains the property
                  of the User, but you grant MyInvite a license to display and
                  promote it.
                </p>

                <h3>7. Limitation of Liability</h3>
                <p>
                  To the fullest extent permitted by law, MyInvite shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages resulting from your use of the Platform.
                </p>

                <h3>8. Changes to Terms</h3>
                <p>
                  We may modify these Terms at any time. We will provide notice
                  of any material changes.
                </p>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-gray-900 mt-0">Questions?</h3>
                  <p>
                    If you have any questions about these Terms, please contact
                    our legal team at{" "}
                    <a
                      href="mailto:legal@myinvite.ng"
                      className="text-violet-600 font-semibold hover:text-violet-700"
                    >
                      legal@myinvite.ng
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
