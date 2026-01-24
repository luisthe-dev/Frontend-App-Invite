"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { hostApi } from "@/api/host";
import { ShieldCheck, Info } from "lucide-react";

export default function TrustScoreWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await hostApi.getTrustScore(); 
        setData(res);
      } catch (error) {
        console.error("Failed to fetch trust score", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, []);

  if (loading) {
    return <Card className="p-6 h-full flex items-center justify-center animate-pulse bg-slate-100 dark:bg-slate-900"></Card>;
  }

  if (!data) return null;

  const { score, tier, next_tier } = data;
  const progress = score; 

  return (
    <Card className="p-6 bg-gradient-to-br from-violet-50 to-white dark:from-slate-900 dark:to-slate-900 border-violet-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-24 h-24 text-violet-600" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-100 uppercase tracking-wider flex items-center gap-1">
                        Trust Score
                        <div title="Your Trust Score determines your early withdrawal limits.">
                            <Info className="w-3.5 h-3.5 text-violet-400 cursor-help" />
                        </div>
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-4xl font-black text-violet-700 dark:text-violet-400">{score}</span>
                        <span className="text-sm text-violet-400 dark:text-slate-500">/ 100</span>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm border border-violet-100 dark:border-slate-700">
                     <span className="text-xs font-bold text-violet-700 dark:text-violet-300">{tier?.name || 'Unranked'}</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Withdrawal Limit</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{tier?.withdrawal_percent || 0}%</span>
                </div>
                
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-violet-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                
                {next_tier && (
                    <p className="text-[10px] text-slate-400 text-center mt-1">
                        {next_tier.min_score - score} points to {next_tier.name}
                    </p>
                )}
            </div>
        </div>
    </Card>
  );
}
