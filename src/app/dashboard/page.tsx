import { currentUser } from '@clerk/nextjs/server';
import UpdateCommitButton from './_components/UpdateCommitButton';
import CommitCharts from './_components/commit-charts';
import { EmptyStateCard } from './_components/empty-state-card';
import { Suspense } from 'react';
import { CommitStreak } from './_components/commit-streak';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CommitStreakEmptyState } from './_components/commit-streak-empty-state';

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="h-full space-y-6 p-8">
      <Card className="">
        <CardHeader className="text-3xl font-bold">
          {`${user?.username}'s Activity`}
        </CardHeader>
        <CardContent className="flex justify-between">
          <Suspense fallback={<CommitStreakEmptyState />}>
            <CommitStreak />
          </Suspense>
          <UpdateCommitButton />
        </CardContent>
      </Card>

      <Suspense fallback={<EmptyStateCard />}>
        <CommitCharts />
      </Suspense>
    </div>
  );
}
