import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { CommitLineChart } from './charts/commit-line-chart';
import CommitTimeHistogram from './charts/commit-time-buckets-chart';
import CommitDayOfWeekHistogram from './charts/commit-day-of-week-chart';

export default async function CommitCharts() {
  const user = await currentUser();

  const commits = await prisma.commit.findMany({
    where: { username: user?.username ?? '' },
    orderBy: { timestamp: 'desc' },
  });
  return (
    <>
      <CommitLineChart commits={commits} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CommitTimeHistogram commits={commits} />
        <CommitDayOfWeekHistogram commits={commits} />
      </div>
    </>
  );
}
