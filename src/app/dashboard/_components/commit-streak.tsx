import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { differenceInCalendarDays, parseISO } from 'date-fns';

function calculateStreaks(dates: Date[]): { current: number; max: number } {
  if (dates.length === 0) return { current: 0, max: 0 };

  let maxStreak = 1;
  let currentStreak = 1;
  const today = new Date();
  let prevDate = dates[0];
  let isCurrentStreak =
    differenceInCalendarDays(today, prevDate) === 0 ||
    differenceInCalendarDays(today, prevDate) === 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = differenceInCalendarDays(prevDate, dates[i]);
    if (diff === 1) {
      currentStreak++;
    } else if (diff > 1) {
      if (isCurrentStreak) isCurrentStreak = false;
      currentStreak = 1;
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
    prevDate = dates[i];
  }

  return {
    current: isCurrentStreak ? currentStreak : 0,
    max: maxStreak,
  };
}

export async function CommitStreak() {
  const user = await currentUser();
  if (!user?.username) {
    return <div className="text-muted-foreground">Not logged in</div>;
  }

  const commits = await prisma.commit.findMany({
    where: { username: user.username },
    select: { timestamp: true },
    orderBy: { timestamp: 'desc' },
  });

  const uniqueDays = Array.from(
    new Set(commits.map((c) => c.timestamp.toISOString().slice(0, 10)))
  )
    .map((d) => parseISO(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const { current, max } = calculateStreaks(uniqueDays);

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, maxCommitStreak: true },
  });

  if (dbUser && (dbUser.maxCommitStreak ?? 0) < max) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { maxCommitStreak: max },
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="text-lg font-semibold">🔥 Commit Streak</div>
      <div>
        <span className="font-bold">{current}</span> day current streak
      </div>
      <div className="text-muted-foreground text-sm">
        Previous record:{' '}
        <span className="font-bold">{dbUser?.maxCommitStreak ?? 0}</span> days
      </div>
    </div>
  );
}
