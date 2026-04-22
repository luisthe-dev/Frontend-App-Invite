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
                  Welcome to MyInvite. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the MyInvite platform, mobile applications, and services (&quot;Services&quot;) operated by Luis Dev Limited (&quot;the Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By creating an account, you agree to be bound by these Terms.
                </p>

                <div className="my-10 p-6 bg-violet-50 rounded-xl border border-violet-100 flex gap-4">
                  <Shield className="w-6 h-6 text-violet-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-violet-900 font-bold m-0 mb-3 text-lg">
                      Terms of Service Highlights
                    </h4>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0"></span>
                        <p className="m-0 text-sm text-violet-800"><strong>User Eligibility:</strong> You must be 18+ to create an event. All hosts must undergo identity verification via Dojah before payouts can be processed and approved.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0"></span>
                        <p className="m-0 text-sm text-violet-800"><strong>Prohibited Content:</strong> MyInvite cannot be used for illegal gatherings, fraudulent ticket sales, or any activity that violates Nigerian law.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0"></span>
                        <p className="m-0 text-sm text-violet-800"><strong>Liability Limitation:</strong> MyInvite is a technology platform. We are not responsible for the physical safety of guests, event cancellations, or the conduct of attendees.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0"></span>
                        <p className="m-0 text-sm text-violet-800"><strong>Fees:</strong> Transaction fees/Service Charges are non-refundable once an invitation or ticket has been processed by our payment gateway.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0"></span>
                        <p className="m-0 text-sm text-violet-800"><strong>AML/CFT:</strong> All Transactions undergo checks for Money Laundering or Terrorism Financing Activities.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">1</span>
                      User Eligibility &amp; Registration
                    </h3>
                    <div className="ml-11 space-y-4 text-gray-600 mt-6">
                      <p className="m-0"><strong>Age Requirement:</strong> Users are required to be at least 18 years of age to create an account and host an event on the site or application.</p>
                      <p className="m-0"><strong>Account Accuracy:</strong> Users agree to provide accurate, current, and complete information during the registration process.</p>
                      <p className="m-0"><strong>Verification:</strong> To maintain platform integrity, all Hosts must undergo identity verification via our third-party partner, Dojah. Failure to complete verification will result in the suspension of payout capabilities.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">2</span>
                      Nature of Service
                    </h3>
                    <p className="ml-11 mt-6 m-0 text-gray-600">
                      MyInvite is a technology platform that facilitates digital invitations, guest management, and event ticketing. The Company is not an event organizer, host, or agent. All events are organized and managed solely by the User (the &quot;Host&quot;).
                    </p>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">3</span>
                      Payments and Fees
                    </h3>
                    <div className="ml-11 space-y-4 text-gray-600 mt-6">
                      <p className="m-0"><strong>Processing:</strong> All financial transactions are processed securely through Paystack.</p>
                      <p className="m-0"><strong>Service Fees:</strong> Every ticket sold or paid invitation processed attracts a fixed charge/service charge. These fees are disclosed at the point of transaction.</p>
                      <p className="m-0"><strong>Payouts:</strong> Funds from ticket sales will be remitted to the Host&apos;s verified bank account following the successful completion of the event, subject to our standard cooling-off period and fraud checks. Total Funds remitted shall be calculated as Total Tickets-Service Charge-Taxes.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">4</span>
                      Prohibited Conduct
                    </h3>
                    <div className="ml-11 mt-6">
                      <p className="mb-4 mt-0 text-gray-600">Users SHALL not use MyInvite for:</p>
                      <ul className="grid sm:grid-cols-2 gap-3 pl-0 list-none m-0">
                        <li className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-100 m-0 text-sm">Organizing illegal gatherings or promoting prohibited substances.</li>
                        <li className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-100 m-0 text-sm">Fraudulent ticket sales or deceptive practices.</li>
                        <li className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-100 m-0 text-sm">Distributing spam or infringing on intellectual property.</li>
                        <li className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-100 m-0 text-sm">Government Takeover activities, planning or execution.</li>
                        <li className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-100 m-0 text-sm sm:col-span-2">Any activity that violates the laws of the Federal Republic of Nigeria.</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">5</span>
                      Cancellations and Refunds
                    </h3>
                    <div className="ml-11 space-y-4 text-gray-600 mt-6">
                      <p className="m-0"><strong>Host Responsibility:</strong> If an event is canceled, the Host is responsible for notifying guests and initiating the refund process.</p>
                      <p className="m-0"><strong>Non-Refundable Fees:</strong> MyInvite&apos;s service fees are non-refundable as they cover the technical cost of processing the invitation and payment.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">6</span>
                      Limitation of Liability
                    </h3>
                    <div className="ml-11 space-y-4 text-gray-600 mt-6">
                      <p className="m-0"><strong>Physical Safety:</strong> The Company is not liable for any injury, loss, or damage occurring at a physical event organized through the platform. Security and Safety measures are strictly the liability of the Event Host(s).</p>
                      <p className="m-0"><strong>Service Availability:</strong> While we strive for 100% uptime on our production environment (hosted via DigitalOcean), we do not guarantee uninterrupted service.</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">7</span>
                      Data Protection
                    </h3>
                    <p className="ml-11 mt-6 m-0 text-gray-600">
                      Your use of the platform is also governed by our Privacy Policy, which details how we handle your personal data in compliance with the Nigeria Data Protection Regulation (NDPR) and GDPR.
                    </p>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">8</span>
                      Intellectual Property
                    </h3>
                    <p className="ml-11 mt-6 m-0 text-gray-600">
                      All software, logos, and designs (including the &quot;MyInvite&quot; name and brand assets) are the exclusive intellectual property of Luis Dev Limited. Users are granted a limited, non-transferable license to use the app for its intended purpose.
                    </p>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">9</span>
                      AML &amp; CFT
                    </h3>
                    <p className="ml-11 mt-6 m-0 text-gray-600">
                      All transactions made on the MyInvite applications and/or sites are subject to Fraud and Terrorism Financing checks in accordance with laws laid down by the Special Control Unit Against Money Laundering, Money Laundering (Prohibition and Prevention) Act and other relevant laws and policies.
                    </p>
                  </section>

                   <section>
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mt-0">
                      <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center text-sm">10</span>
                      Governing Law &amp; Changes
                    </h3>
                    <p className="ml-11 mt-6 m-0 text-gray-600">
                      These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts in Lagos, Nigeria. We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms on this page.
                    </p>
                  </section>
                </div>

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
