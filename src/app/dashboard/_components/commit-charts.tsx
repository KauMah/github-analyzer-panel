import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { CommitLineChart } from './charts/commit-line-chart';

export default async function CommitCharts() {
  const user = await currentUser();
  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  await delay(3000);

  const commits = await prisma.commit.findMany({
    where: { username: user?.username ?? '' },
    orderBy: { timestamp: 'desc' },
  });
  return (
    <>
      <CommitLineChart commits={commits} />
    </>
  );
}
