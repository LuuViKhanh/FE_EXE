import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';

export function StatsCardSkeleton() {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-16 h-6 rounded" />
        </div>
        <div>
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-16 h-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BatchCardSkeleton() {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-full h-2 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardLoadingState() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-64 h-4" />
        </div>
        <Skeleton className="w-40 h-10 rounded-lg" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Batches Skeleton */}
      <div>
        <Skeleton className="w-48 h-7 mb-4" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(3)].map((_, i) => (
            <BatchCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
