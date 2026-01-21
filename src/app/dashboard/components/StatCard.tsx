import { Card } from "@/components/ui/Card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: {
        value: number;
        label: string;
        positive: boolean;
    };
    loading?: boolean;
}

export default function StatCard({ title, value, icon: Icon, trend, loading }: StatCardProps) {
    if (loading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
                </div>
                <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-600" />
                </div>
            </div>
            
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-1 text-sm ${
                            trend.positive ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {trend.positive ? (
                                <ArrowUpRight className="w-4 h-4" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span className="font-medium">{Math.abs(trend.value)}%</span>
                            <span className="text-slate-500">{trend.label}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
