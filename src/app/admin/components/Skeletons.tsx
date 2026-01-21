import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex-grow p-6 sm:p-8 w-full animate-pulse">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 h-32 flex flex-col justify-between">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                </div>
            ))}
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 h-[400px]">
                     <Skeleton className="h-6 w-48 mb-6" />
                     <div className="space-y-4">
                        {[...Array(5)].map((_, j) => (
                            <div key={j} className="flex justify-between items-center">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-8 w-12" />
                            </div>
                        ))}
                     </div>
                </div>
            ))}
        </div>
    </div>
  );
}

export function TableSkeleton() {
    return (
        <div className="w-full animate-pulse">
             <div className="flex justify-between items-center mb-8">
                 <div className="space-y-2">
                     <Skeleton className="h-8 w-48" />
                     <Skeleton className="h-4 w-64" />
                 </div>
                 <div className="flex gap-3">
                     <Skeleton className="h-10 w-64 rounded-lg" />
                     <Skeleton className="h-10 w-32 rounded-lg" />
                 </div>
             </div>

             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                 <div className="border-b border-gray-200 bg-gray-50 h-12 w-full" />
                 {[...Array(8)].map((_, i) => (
                     <div key={i} className="flex items-center p-4 border-b border-gray-100 last:border-0">
                         <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                         <div className="flex-1 space-y-2">
                             <Skeleton className="h-4 w-48" />
                             <Skeleton className="h-3 w-24" />
                         </div>
                         <Skeleton className="h-4 w-32 mx-4" />
                         <Skeleton className="h-4 w-24 mx-4" />
                         <Skeleton className="h-6 w-20 rounded-full mx-4" />
                         <Skeleton className="h-8 w-24 rounded-lg ml-auto" />
                     </div>
                 ))}
             </div>
        </div>
    )
}
