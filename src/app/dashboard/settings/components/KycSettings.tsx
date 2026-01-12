import { useState, useEffect } from "react";
import { kycApi } from "@/api/kyc";
import { authService } from "@/api/auth";
import { BadgeCheck, ShieldAlert, Loader2, UserCheck } from "lucide-react";
// @ts-ignore
import Dojah from 'react-dojah';

interface KycSettingsProps {
    user: any;
    onUserUpdate: (user: any) => void;
}

export default function KycSettings({ user, onUserUpdate }: KycSettingsProps) {
    const [config, setConfig] = useState<any>(null);
    const [loadingConfig, setLoadingConfig] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            setLoadingConfig(true);
            try {
                const res = await kycApi.getWidgetConfig();
                setConfig(res.data);
            } catch (error) {
                console.error("Failed to load KYC config", error);
            } finally {
                setLoadingConfig(false);
            }
        };

        if (user && user.kyc_status !== 'verified') {
            fetchConfig();
        }
    }, [user]);

    const handleSuccess = async (response: any) => {
        console.log('Dojah Success', response);
        setVerifying(true);
        try {
            // response usually contains reference_id
            await kycApi.handleVerificationSuccess({
                reference_id: response.reference_id || 'manual_ref', // Adjust based on actual Dojah response
                status: 'success', // or response.status
                ...response
            });
            
            const updatedUser = { ...user, kyc_status: 'verified' };
            onUserUpdate(updatedUser);
            authService.updateUser(updatedUser);
        } catch (error) {
            console.error("Failed to update backend", error);
        } finally {
            setVerifying(false);
        }
    };

    const handleClose = () => {
        console.log('Dojah Closed');
    };

    const handleError = (error: any) => {
        console.log('Dojah Error', error);
    };

    if (user?.kyc_status === 'verified') {
        return (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <BadgeCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-1">Identity Verified</h3>
                <p className="text-green-700 text-sm">Your identity has been successfully verified. You have full access to all features.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Identity Verification</h3>
                    <p className="text-sm text-gray-500">
                        To ensure the safety of our platform and comply with regulations, we require you to verify your identity.
                    </p>
                </div>
            </div>

            {loadingConfig ? (
                <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
                </div>
            ) : (
                <div className="flex justify-end">
                    {config ? (
                         <Dojah
                            response={handleSuccess}
                            appID={config.app_id}
                            publicKey={config.p_key}
                            userData={{
                                first_name: config.first_name,
                                last_name: config.last_name,
                                dob: "", // Optional
                                residence_country: "NG" // Dynamic if needed
                            }}
                            config={{
                                debug: true,
                                // select specific services if needed, e.g.
                                // widget_id: "..." 
                            }}
                        >
                            <button className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors shadow-sm hover:shadow-md flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Verify Identity
                            </button>
                        </Dojah>
                    ) : (
                        <p className="text-red-500 text-sm">Unable to load verification service.</p>
                    )}
                </div>
            )}
        </div>
    );
}
