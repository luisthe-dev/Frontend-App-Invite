import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Scale, FileKey, ShieldAlert } from "lucide-react";

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-emerald-900 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
            <Scale className="w-4 h-4" />
            <span>Compliance Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            GDPR &amp; NDPR Compliance
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Your data rights under the General Data Protection Regulation (GDPR) and the Nigeria Data Protection Regulation (NDPR).
          </p>
        </div>
      </div>

      <main className="flex-grow -mt-12 pb-20 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>
                Effective Date: <strong>April 10, 2026</strong>
              </span>
              <span className="hidden sm:inline-block">Status: Active</span>
            </div>

            <div className="p-8 md:p-12">
              <div className="prose prose-lg prose-emerald max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-emerald-600">
                <p className="text-xl text-gray-700 leading-relaxed font-medium mb-8">
                  MyInvite operates with strict adherence to both the European Union's GDPR and the Federal Republic of Nigeria's NDPR. We believe that privacy is a fundamental human right.
                </p>

                <div className="my-10 grid sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-4 hover:border-emerald-200 transition-colors">
                    <FileKey className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-emerald-900 font-bold m-0 mb-2">Data Portability</h4>
                      <p className="text-emerald-700 m-0 text-sm">You have the right to request a complete export of all data associated with your account at any time in a structured format.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-4 hover:border-emerald-200 transition-colors">
                    <ShieldAlert className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-emerald-900 font-bold m-0 mb-2">Right to Erasure</h4>
                      <p className="text-emerald-700 m-0 text-sm">Under "Right to be Forgotten" mandates, you can request permanent deletion of your data unless legally hindered.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">1. Your Rights Under GDPR and NDPR</h3>
                    <p className="text-gray-600 m-0 mb-4">As a user of the MyInvite platform, you are guaranteed specific rights over your personal data:</p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block">Right to Non-discrimination:</strong>
                        <span className="text-sm">You will never be denied service or charged different prices for exercising your privacy rights.</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block">Right to Access:</strong>
                        <span className="text-sm">You can request a clear copy of the personal information we hold about you.</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <strong className="text-gray-900 block">Right to Rectification &amp; Restrict Processing:</strong>
                        <span className="text-sm">If any data we hold is inaccurate, you have the right to have it corrected or halt processing.</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">2. Lawful Basis of Processing &amp; Cross-Border Transfers</h3>
                    <p className="mt-0">Under Article 6 of the GDPR and Section 2.2 of the NDPR, MyInvite processes your personal data lawfully, fairly, and transparently, primarily based on the fulfillment of contractual obligations, legal compliance (KYC and AML requirements), and your explicit consent.</p>
                    <p>Because MyInvite leverages global infrastructure (like DigitalOcean and Paystack), data may be transferred across borders. All transfers are backed by appropriate safeguards, including Standard Contractual Clauses (SCCs) and adherence to NDPC whitelists.</p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">3. Data Breach Protocol</h3>
                    <p className="mt-0">MyInvite has a strict 72-hour breach notification policy. In the unlikely event of a data breach that poses a severe risk to your rights, we will notify both you and the relevant supervisory authority (such as the NDPC) within 72 hours.</p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">4. Contacting the Data Protection Officer</h3>
                    <p className="mt-0">MyInvite has appointed a dedicated Data Protection Officer (DPO) to oversee compliance strategy. You can reach out directly with requests or concerns.</p>
                  </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h3 className="text-gray-900 mt-0">Exercise Your Rights</h3>
                  <p>
                    To submit a Data Subject Access Request (DSAR) or speak to our DPO, please email:{" "}
                    <a href="mailto:dpo@myinvite.ng" className="font-semibold text-emerald-600">
                      dpo@myinvite.ng
                    </a>
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
