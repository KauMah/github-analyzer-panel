import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { CommitLineChart } from './charts/commit-line-chart';
import CommitTimeHistogram from './charts/commit-time-buckets-chart';

export default async function CommitCharts() {
  const user = await currentUser();

  const commits = await prisma.commit.findMany({
    where: { username: user?.username ?? '' },
    orderBy: { timestamp: 'desc' },
  });
  return (
    <>
      <CommitLineChart commits={commits} />
      <CommitTimeHistogram commits={commits} />
    </>
  );
}
