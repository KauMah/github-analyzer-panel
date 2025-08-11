import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { differenceInCalendarDays, parseISO, isWeekend } from 'date-fns';

function calculateCurrentStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  const mostRecentDate = dates[0];
  const daysFromToday = differenceInCalendarDays(today, mostRecentDate);

  // If most recent commit is more than 1 weekday away, no current streak
  if (daysFromToday > 1) return 0;

  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const currentDate = dates[i];
    const previousDate = dates[i - 1];
    const diff = differenceInCalendarDays(previousDate, currentDate);

    if (diff === 1) {
      // Consecutive days
      currentStreak++;
    } else if (diff > 1) {
      // Check if the gap is only weekends
      let isOnlyWeekends = true;
      const checkDate = new Date(previousDate);
      checkDate.setDate(checkDate.getDate() - 1);

      while (differenceInCalendarDays(previousDate, checkDate) > 0) {
        if (!isWeekend(checkDate)) {
          isOnlyWeekends = false;
          break;
        }
        checkDate.setDate(checkDate.getDate() - 1);
      }

      if (isOnlyWeekends) {
        // Only weekends in the gap, streak continues
        currentStreak++;
      } else {
        // Weekday gap found, streak ends
        break;
      }
    } else {
      // Same day, continue
      continue;
    }
  }

  return currentStreak;
}

function calculateMaxStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  if (dates.length === 1) return 1;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = dates.length - 1; i > 0; i--) {
    const currentDate = dates[i];
    const nextDate = dates[i - 1];
    const diff = differenceInCalendarDays(nextDate, currentDate);

    if (diff === 1) {
      // Consecutive days
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else if (diff > 1) {
      // Check if the gap is only weekends
      let isOnlyWeekends = true;
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() + 1);

      while (differenceInCalendarDays(nextDate, checkDate) > 0) {
        if (!isWeekend(checkDate)) {
          isOnlyWeekends = false;
          break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }

      if (isOnlyWeekends) {
        // Only weekends in the gap, streak continues
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        // Weekday gap found, streak ends
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
        currentStreak = 1;
      }
    } else {
      // Same day, continue
      continue;
    }
  }

  return maxStreak;
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

  const current = calculateCurrentStreak(uniqueDays);
  const max = calculateMaxStreak(uniqueDays);

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { clerkId: true, maxCommitStreak: true },
  });

  if (dbUser && (dbUser.maxCommitStreak ?? 0) < max) {
    await prisma.user.update({
      where: { clerkId: dbUser.clerkId },
      data: { maxCommitStreak: max },
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="text-lg font-semibold">Commit Streak 🔥</div>
      <div>
        <span className="font-bold">{current}</span> day current streak
      </div>
      <div className="text-muted-foreground text-sm">
        Previous record:{' '}
        <span className="font-bold">
          {Math.max(max, dbUser?.maxCommitStreak ?? 0)}
        </span>{' '}
        days
      </div>
    </div>
  );
}
