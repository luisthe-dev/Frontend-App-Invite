import { useState, useEffect } from "react";
import { kycApi } from "@/api/kyc";
import { authService } from "@/api/auth";
import { BadgeCheck, ShieldAlert, Loader2, UserCheck } from "lucide-react";
// @ts-ignore
import Dojah from "dojah-kyc-sdk-react";
import { toast } from "sonner";

interface KycSettingsProps {
  user: any;
  onUserUpdate: (user: any) => void;
}

export default function KycSettings({ user, onUserUpdate }: KycSettingsProps) {
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [started, setStarted] = useState(false);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    setStarted(true);
    try {
      const res = await kycApi.getWidgetConfig();
      setConfig(res);
    } catch (error) {
      console.error("Failed to load KYC config", error);
      setStarted(false); // Reset if failed so they can try again
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleDojahResponse = async (type: string, data: any) => {
    if (type === "success") {
      setVerifying(true);
      try {
        const verificationData = await kycApi.handleVerificationSuccess({
          reference_id: data.reference_id || data.referenceId || "",
          status: "success",
          ...data,
        });

        if (verificationData.status) {
          const updatedUser = verificationData.data;
          onUserUpdate(updatedUser);
          authService.updateUser(updatedUser);
        }
        window.location.reload();
      } catch (error) {
        toast.error(
          "Error Processing Verification Data. Please wait 30 minutes!",
        );
        console.error("Failed to update backend", error);
      } finally {
        setVerifying(false);
        setStarted(false); // Reset to show status
      }
    } else if (type === "error") {
      console.error("Dojah Verification Error", data);
    } else if (type === "close") {
      console.log("Dojah Widget Closed");
    }
  };

  // Helper to render status badge
  const StatusBadge = ({ full = false }) => (
    <div
      className={`bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-xl p-6 flex flex-col items-center text-center ${full ? "mb-6" : ""}`}
    >
      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4">
        <BadgeCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-1">
        {user?.kyc_status === "tier2" ? "Business Verified" : "Basic Verified"}
      </h3>
      <p className="text-green-700 dark:text-green-400 text-sm">
        {user?.kyc_status === "tier2"
          ? "Your business identity has been verified."
          : "Your basic identity has been verified. You can now host events and request withdrawals."}
          {/* : "Your basic identity has been verified. You can now upgrade to Business Verification."} */}
      </p>
    </div>
  );

  // If fully verified (tier2), show success message
  if (user?.kyc_status === "tier2") {
    return <StatusBadge />;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center shrink-0">
          <UserCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
            Identity Verification
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete verification to unlock higher limits and features.
          </p>
        </div>
      </div>

      {/* Show Current Status if Tier 1 */}
      {(user?.kyc_status === "tier1" || user?.kyc_status === "verified") && (
        <StatusBadge full />
      )}

      {user?.kyc_status !== 'tier1' && !started && !config && (
        <div className="flex justify-end bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
          <button
            onClick={fetchConfig}
            className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {user?.kyc_status === "tier1" || user?.kyc_status === "verified" ? (
              <>
                <ShieldAlert className="w-4 h-4" />
                Start Business Verification
              </>
            ) : (
              "Start Basic Verification"
            )}
          </button>
        </div>
      )}

      {loadingConfig && (
        <div className="flex justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        </div>
      )}

      {config && (
        <div className="flex justify-end">
          <Dojah
            response={handleDojahResponse}
            appID={config.app_id}
            publicKey={config.p_key}
            type="custom"
            config={{
              widget_id:
                user?.kyc_status === "tier1" || user?.kyc_status === "verified"
                  ? process.env.NEXT_PUBLIC_DOJAH_BUSINESS_WIDGET_ID
                  : process.env.NEXT_PUBLIC_DOJAH_EVENT_WIDGET_ID,
            }}
            userData={{
              first_name: config.first_name,
              last_name: config.last_name,
              dob: "",
            }}
            metadata={{
              user_id: user?.id,
              tier_attempt:
                user?.kyc_status === "tier1" || user?.kyc_status === "verified"
                  ? "tier2"
                  : "tier1",
            }}
          >
            <button className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm hover:shadow-md flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Continue to Verification
            </button>
          </Dojah>
        </div>
      )}
    </div>
  );
}
