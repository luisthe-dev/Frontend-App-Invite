import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, CreditCard, Ticket } from "lucide-react";

interface Activity {
    id: string;
    type: string;
    amount: number;
    description: string;
    created_at: string;
    status: string;
}

interface RecentActivityProps {
    activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No recent activity.</p>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    activity.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                    {activity.type === 'credit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{activity.description}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(activity.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${
                                    activity.type === 'credit' ? 'text-green-600' : 'text-slate-900'
                                }`}>
                                    {activity.type === 'credit' ? '+' : '-'}{formatCurrency(activity.amount)}
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                    activity.status === 'success' ? 'bg-green-100 text-green-700' :
                                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {activity.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
