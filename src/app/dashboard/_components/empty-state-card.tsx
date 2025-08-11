import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function EmptyStateCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Commits per Calendar Day</CardTitle>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Commits Chart Skeleton */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Commits & Activity</h3>
            <div className="bg-muted/20 h-[300px] w-full rounded-lg border">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <p className="text-muted-foreground text-sm">
                    Loading commit data...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lines Chart Skeleton */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Lines Added vs Removed
            </h3>
            <div className="bg-muted/20 h-[300px] w-full rounded-lg border">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                  <p className="text-muted-foreground text-sm">
                    Loading line data...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <Skeleton className="mx-auto mb-1 h-8 w-16" />
            <Skeleton className="mx-auto h-3 w-24" />
          </div>
          <div className="text-center">
            <Skeleton className="mx-auto mb-1 h-8 w-16" />
            <Skeleton className="mx-auto h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
