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
                <p className="text-xl text-gray-700 leading-relaxed font-medium mb-6 mt-0">
                  At MYINVITE (the &quot;Company&quot;), we respect the privacy of our users and are committed to protecting their personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard the personal data of freelancers, employers, and other visitors to our platforms, which includes our website and mobile application.
                </p>
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl mb-10">
                  <p className="m-0 text-gray-700 leading-relaxed text-base">
                    When you use our services, provide us with details of your Personal Data or click on the &quot;accept&quot; button, you accept this Privacy Policy and hereby give us consent to save, process and use your Personal Data to the extent as allowed by law. We encourage you to review our Privacy Policy whenever you interact with us to stay informed about our information practices and the ways you can help protect your privacy.
                  </p>
                </div>

                <div className="my-10 grid sm:grid-cols-3 gap-6">
                  <div className="p-6 bg-violet-50 rounded-xl flex flex-col items-center justify-center text-center border border-transparent hover:border-violet-200 transition-colors">
                    <div className="w-12 h-12 bg-white shadow-sm text-violet-600 rounded-full flex items-center justify-center mb-4">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h4 className="text-gray-900 font-bold mb-2 m-0 text-base">Transparency</h4>
                    <p className="text-sm text-gray-500 m-0">We only use data as allowed by law.</p>
                  </div>
                  <div className="p-6 bg-violet-50 rounded-xl flex flex-col items-center justify-center text-center border border-transparent hover:border-violet-200 transition-colors">
                    <div className="w-12 h-12 bg-white shadow-sm text-violet-600 rounded-full flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="text-gray-900 font-bold mb-2 m-0 text-base">Security</h4>
                    <p className="text-sm text-gray-500 m-0">Top-tier encryption &amp; NDPR compliance.</p>
                  </div>
                  <div className="p-6 bg-violet-50 rounded-xl flex flex-col items-center justify-center text-center border border-transparent hover:border-violet-200 transition-colors">
                    <div className="w-12 h-12 bg-white shadow-sm text-violet-600 rounded-full flex items-center justify-center mb-4">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <h4 className="text-gray-900 font-bold mb-2 m-0 text-base">Control</h4>
                    <p className="text-sm text-gray-500 m-0">Rights to access, edit, &amp; erase data.</p>
                  </div>
                </div>

                <div className="space-y-12 mt-12">
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">1. Information We Collect</h3>
                    <p className="text-gray-600 mb-6 mt-0">We collect both personal and non-personal information from users, including but not limited to:</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 mt-0 text-lg">Personal Information</h4>
                        <ul className="space-y-2 text-gray-600 text-sm m-0 pl-4 list-disc marker:text-violet-500">
                          <li>Full name, Contact details (email address, phone number).</li>
                          <li>Identification documents (e.g., national ID, passport).</li>
                          <li>Payment and financial information (e.g., bank account details).</li>
                          <li>Business details (where applicable) and Event Details.</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4 mt-0 text-lg">Non-Personal Information</h4>
                        <ul className="space-y-2 text-gray-600 text-sm m-0 pl-4 list-disc marker:text-violet-500">
                          <li>Usage data such as IP addresses, device information, browser type, and platform usage analytics.</li>
                          <li>Cookies and tracking information to enhance user experience and track website/app performance.</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">2. How We Use Information</h3>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">1</div>
                        <div>
                          <p className="m-0 text-gray-900 font-semibold mb-1">User Account Management</p>
                          <p className="m-0 text-sm text-gray-600">To verify users&apos; identities (KYC process), facilitate user account creation, and provide access to our services.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">2</div>
                        <div>
                          <p className="m-0 text-gray-900 font-semibold mb-1">Transaction Processing</p>
                          <p className="m-0 text-sm text-gray-600">To process payments, withdrawals, and other financial transactions regarding Host&apos;s event(s).</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">3</div>
                        <div>
                          <p className="m-0 text-gray-900 font-semibold mb-1">Compliance and Security</p>
                          <p className="m-0 text-sm text-gray-600">To comply with applicable legal and regulatory obligations, including Anti-Money Laundering (AML) requirements, and to ensure the security and integrity of our platform.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">3. Legal Basis For Processing</h3>
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl space-y-4">
                      <p className="m-0 text-gray-600">We process personal data based on the following legal grounds:</p>
                      <ul className="text-sm text-gray-600 space-y-2 m-0 pl-4 list-disc marker:text-violet-500">
                        <li><strong>Consent:</strong> By using our platform and providing your information, you consent to the collection and processing of your data.</li>
                        <li><strong>Contractual Necessity:</strong> We process personal data to fulfill our contractual obligations with users.</li>
                        <li><strong>Legal Obligation / Legitimate Interests:</strong> To comply with legal and regulatory requirements (AML/KYC), fraud prevention, and platform security.</li>
                      </ul>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 text-sm text-gray-600 mt-4">
                        MyInvite is based in Nigeria and the information we collect is governed by the Nigerian Data Protection Regulation (NDPR) and the Nigerian Data Protection Act (NDPA). By accessing or using the Services or otherwise providing information to us, you consent to the processing and transfer of information in and to Nigeria.
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">4. Data Retention</h3>
                    <p className="text-gray-600 m-0">We retain personal information for as long as it is necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce agreements. Data related to financial transactions and compliance with regulatory requirements (e.g., AML laws) will be retained for the required period under Nigerian law.</p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">5. Sharing of Information</h3>
                    <ul className="space-y-4 m-0 pl-0 list-none text-gray-600">
                      <li className="flex gap-3"><span className="text-violet-500 font-bold">✓</span> Service Providers: third-party service providers (like Paystack) that assist with identity verification, payment processing, etc., in compliance with NDPA.</li>
                      <li className="flex gap-3"><span className="text-violet-500 font-bold">✓</span> Legal Compliance &amp; Business Transfers: to law enforcement agencies if required by law, or in the event of a merger, acquisition, or asset sale.</li>
                      <li className="flex gap-3"><span className="text-violet-500 font-bold">✓</span> With your consent: or at your direction, or anonymized Information which cannot reasonably be used to identify you.</li>
                    </ul>
                    <p className="mt-6 text-gray-600 mb-0">When we do not have a lawful basis for disclosure of your Personal Data, we will obtain consent from you before sharing. We do not sell, trade, or rent users&apos; personal information to third parties for marketing purposes.</p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">6. User Rights</h3>
                    <ul className="grid sm:grid-cols-2 gap-4 list-none m-0 pl-0">
                      <li className="bg-violet-50 p-4 rounded-lg border border-violet-100 m-0">
                        <strong className="block text-violet-900 mb-1 leading-snug">Access, Correction, &amp; Erasure</strong>
                        <span className="text-sm text-violet-700">Request access to, correct, or request deletion of personal information.</span>
                      </li>
                      <li className="bg-violet-50 p-4 rounded-lg border border-violet-100 m-0">
                        <strong className="block text-violet-900 mb-1 leading-snug">Restriction &amp; Portability</strong>
                        <span className="text-sm text-violet-700">Request the limitation of data processing or to receive a copy of their personal data.</span>
                      </li>
                      <li className="bg-violet-50 p-4 rounded-lg border border-violet-100 m-0 sm:col-span-2">
                        <strong className="block text-violet-900 mb-1 leading-snug">Objection &amp; Complaints</strong>
                        <span className="text-sm text-violet-700">Object to the processing of their data, and lodge a complaint with the Nigeria Data Protection Commission (NDPC).</span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">7. Data Security &amp; Tracking</h3>
                    <p className="text-gray-600 m-0">We take the security of our users&apos; data seriously and have implemented appropriate technical and organizational measures (Data encryption, secure storage, regular audits, secure access controls). However, no online platform is entirely risk-free. Our platform also uses cookies and other tracking technologies to enhance user experience; users can control cookie preferences through browser settings.</p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">8. Third Party Links &amp; International Transfers</h3>
                    <p className="text-gray-600 m-0">Our platform may contain links to third-party websites. This Privacy Policy does not apply to third-party sites. While our operations are primarily based in Nigeria, user data may be transferred to or stored in other jurisdictions in compliance with applicable data protection laws.</p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 mt-0">9. Changes to this Policy</h3>
                    <p className="text-gray-600 m-0">We reserve the right to update this Privacy Policy from time to time to reflect changes in our business, services or legal obligations. Users will be notified of any significant changes.</p>
                  </section>
                </div>

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
