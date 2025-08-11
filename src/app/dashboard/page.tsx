import { currentUser } from '@clerk/nextjs/server';
import UpdateCommitButton from './_components/UpdateCommitButton';
import CommitCharts from './_components/commit-charts';
import { EmptyStateCard } from './_components/empty-state-card';
import { Suspense } from 'react';

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="h-full space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{user?.username ?? 'Dashboard'}</h1>
        <UpdateCommitButton />
      </div>

      <Suspense fallback={<EmptyStateCard />}>
        <CommitCharts />
      </Suspense>
    </div>
  );
}
