import { Skeleton } from '@/components/ui/skeleton';

export const CommitStreakEmptyState = () => {
  return (
    <div className="h-20 w-40 space-y-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
};
