'use client';

import { useMemo } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface Commit {
  repo: string;
  username: string;
  hash: string;
  timestamp: Date;
  files: number;
  linesAdded: number;
  linesDeleted: number;
}

interface CommitDayOfWeekHistogramProps {
  commits?: Commit[];
}

export default function CommitDayOfWeekHistogram({
  commits = [],
}: CommitDayOfWeekHistogramProps) {
  const chartData = useMemo(() => {
    const dayBuckets = [
      { label: 'Sunday', day: 0, shortLabel: 'Sun' },
      { label: 'Monday', day: 1, shortLabel: 'Mon' },
      { label: 'Tuesday', day: 2, shortLabel: 'Tue' },
      { label: 'Wednesday', day: 3, shortLabel: 'Wed' },
      { label: 'Thursday', day: 4, shortLabel: 'Thu' },
      { label: 'Friday', day: 5, shortLabel: 'Fri' },
      { label: 'Saturday', day: 6, shortLabel: 'Sat' },
    ];

    const bucketCounts = dayBuckets.map((bucket) => ({
      ...bucket,
      commits: 0,
      percentage: 0,
    }));

    commits.forEach((commit) => {
      const localTime = new Date(commit.timestamp);
      const dayOfWeek = localTime.getDay();

      const bucketIndex = bucketCounts.findIndex(
        (bucket) => bucket.day === dayOfWeek
      );

      if (bucketIndex !== -1) {
        bucketCounts[bucketIndex].commits++;
      }
    });

    const totalCommits = commits.length;
    bucketCounts.forEach((bucket) => {
      bucket.percentage =
        totalCommits > 0
          ? Math.round((bucket.commits / totalCommits) * 100)
          : 0;
    });

    return bucketCounts;
  }, [commits]);

  const chartConfig = {
    commits: {
      label: 'Commits',
      color: '#10b981',
    },
  };

  const mostActiveDay = useMemo(() => {
    return chartData.reduce(
      (max, current) => (current.commits > max.commits ? current : max),
      chartData[0]
    );
  }, [chartData]);

  const topWeekPatterns = useMemo(() => {
    if (commits.length === 0) return null;

    const weekdays = chartData.slice(1, 6);
    const weekends = [chartData[0], chartData[6]];

    const weekdayTotal = weekdays.reduce((sum, day) => sum + day.commits, 0);
    const weekendTotal = weekends.reduce((sum, day) => sum + day.commits, 0);
    const totalCommits = commits.length;

    const weekdayPercentage = (weekdayTotal / totalCommits) * 100;
    const weekendPercentage = (weekendTotal / totalCommits) * 100;

    const maxCommits = Math.max(...chartData.map((day) => day.commits));
    const avgCommits = totalCommits / 7;
    const variance =
      chartData.reduce(
        (sum, day) => sum + Math.pow(day.commits - avgCommits, 2),
        0
      ) / 7;
    const stdDev = Math.sqrt(variance);

    const mondayCommits = chartData[1].commits;
    const fridayCommits = chartData[5].commits;
    const mondayFridayTotal = mondayCommits + fridayCommits;

    const midweekCommits = chartData
      .slice(2, 5)
      .reduce((sum, day) => sum + day.commits, 0);

    const patterns = [
      {
        type: 'The Weekday Warrior',
        description:
          'You code primarily during the workweek, maintaining a traditional 9-to-5 schedule with minimal weekend activity.',
        icon: '💼',
        color: 'text-blue-600',
        score: Math.min(
          100,
          Math.max(
            0,
            weekdayPercentage * 0.8 +
              (weekdayPercentage > 80 ? 20 : 0) +
              (weekendPercentage < 20 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Weekend Coder',
        description:
          'You prefer coding on weekends, likely balancing a busy weekday schedule with dedicated weekend development time.',
        icon: '🏖️',
        color: 'text-orange-600',
        score: Math.min(
          100,
          Math.max(
            0,
            weekendPercentage * 0.8 +
              (weekendPercentage > 60 ? 20 : 0) +
              (weekdayPercentage < 40 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Balanced Developer',
        description:
          'You code throughout the week with a good balance between workdays and weekends, showing consistent dedication.',
        icon: '⚖️',
        color: 'text-green-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (1 - Math.abs(weekdayPercentage - 60) / 60) * 50 +
              (weekendPercentage > 20 && weekendPercentage < 50 ? 30 : 0) +
              (stdDev < avgCommits * 0.8 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Flexible Coder',
        description:
          'Your coding schedule is highly flexible, adapting to various commitments and project needs across the week.',
        icon: '🎯',
        color: 'text-purple-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (chartData.filter((day) => day.commits > avgCommits * 0.3).length /
              7) *
              50 +
              (stdDev > avgCommits * 1.2 ? 30 : 0) +
              (maxCommits < avgCommits * 3 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Monday-Friday Specialist',
        description:
          'You focus on the bookends of the workweek, often starting strong on Monday and finishing projects on Friday.',
        icon: '📅',
        color: 'text-indigo-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (mondayFridayTotal / totalCommits) * 100 +
              (mondayCommits > avgCommits * 1.2 ? 20 : 0) +
              (fridayCommits > avgCommits * 1.2 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Midweek Master',
        description:
          'You prefer the middle of the workweek for coding, avoiding the Monday rush and Friday wind-down.',
        icon: '🎯',
        color: 'text-teal-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (midweekCommits / totalCommits) * 100 +
              (midweekCommits > mondayFridayTotal ? 30 : 0) +
              (chartData[2].commits > avgCommits * 1.1 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Sunday Starter',
        description:
          'You begin your coding week on Sunday, preparing for the workweek ahead with early planning and setup.',
        icon: '🌅',
        color: 'text-amber-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (chartData[0].commits / totalCommits) * 100 +
              (chartData[0].commits > chartData[6].commits ? 30 : 0) +
              (chartData[0].commits > avgCommits * 1.5 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Saturday Night Coder',
        description:
          'You save your most intensive coding sessions for Saturday nights, when you have uninterrupted time for deep work.',
        icon: '🌙',
        color: 'text-pink-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (chartData[6].commits / totalCommits) * 100 +
              (chartData[6].commits > chartData[0].commits ? 30 : 0) +
              (chartData[6].commits > avgCommits * 1.5 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Consistent Daily Coder',
        description:
          'You code almost every day with minimal variation, showing remarkable consistency and dedication to daily practice.',
        icon: '📊',
        color: 'text-emerald-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (chartData.filter((day) => day.commits > 0).length / 7) * 70 +
              (stdDev < avgCommits * 0.5 ? 30 : 0)
          )
        ),
      },
      {
        type: 'The Burst Weekender',
        description:
          'You have intense coding sessions on weekends with minimal weekday activity, typical of side project enthusiasts.',
        icon: '⚡',
        color: 'text-yellow-600',
        score: Math.min(
          100,
          Math.max(
            0,
            weekendPercentage * 0.6 +
              (maxCommits > avgCommits * 2 ? 30 : 0) +
              (weekdayPercentage < 30 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Work-Life Balancer',
        description:
          'You maintain clear boundaries between work and personal time, with distinct patterns for weekdays vs weekends.',
        icon: '🎭',
        color: 'text-cyan-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (Math.abs(weekdayPercentage - 70) < 20 ? 40 : 0) +
              (Math.abs(weekendPercentage - 30) < 20 ? 40 : 0) +
              (stdDev > avgCommits * 0.8 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Opportunistic Coder',
        description:
          'You code whenever you find time, resulting in irregular patterns that adapt to your changing schedule.',
        icon: '🎲',
        color: 'text-gray-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (stdDev / avgCommits) * 40 +
              (chartData.filter((day) => day.commits > 0).length >= 5
                ? 30
                : 0) +
              (maxCommits > avgCommits * 1.5 ? 30 : 0)
          )
        ),
      },
    ];

    const topPatterns = patterns
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((pattern) => ({
        ...pattern,
        score: Math.round(pattern.score),
        weekdayPercentage: Math.round(weekdayPercentage),
        weekendPercentage: Math.round(weekendPercentage),
      }));

    return topPatterns;
  }, [chartData, commits.length]);

  if (!commits.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commit Day Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            No commit data available. Start making commits to see your weekly
            patterns!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Day of Week Patterns</CardTitle>
        <p className="text-muted-foreground text-sm">
          Commit distribution by day of the week
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex w-full justify-center">
          <ChartContainer
            config={chartConfig}
            className="h-[400px] w-full max-w-4xl"
          >
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="shortLabel"
                tick={{ fontSize: 12 }}
                height={60}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Number of Commits',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !label) return null;
                  const data = payload[0]?.payload;
                  return (
                    <div className="bg-background rounded-lg border p-3 shadow-md">
                      <p className="font-semibold">{data?.label}</p>
                      <p className="text-sm">
                        <span
                          className="font-medium"
                          style={{ color: chartConfig.commits.color }}
                        >
                          Commits: {data?.commits}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">
                          {data?.percentage}% of total activity
                        </span>
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.commits === mostActiveDay.commits
                        ? '#059669'
                        : '#34d399'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {mostActiveDay.label}
            </div>
            <p className="text-muted-foreground text-sm">Most Active Day</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {mostActiveDay.commits} commits
            </p>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {topWeekPatterns?.[0]?.weekdayPercentage}%
            </div>
            <p className="text-muted-foreground text-sm">Weekday Activity</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Mon-Fri commits
            </p>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {topWeekPatterns?.[0]?.weekendPercentage}%
            </div>
            <p className="text-muted-foreground text-sm">Weekend Activity</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Sat-Sun commits
            </p>
          </div>
        </div>

        {topWeekPatterns && (
          <div className="mt-6">
            <h3 className="mb-4 text-center text-lg font-semibold">
              Your Top Weekly Patterns
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {topWeekPatterns.map((pattern, index) => (
                <div
                  key={pattern.type}
                  className={`rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800 ${
                    index === 0
                      ? 'ring-2 ring-green-200 dark:ring-green-800'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`text-2xl ${pattern.color}`}>
                        {pattern.icon}
                      </div>
                      {index === 0 && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900 dark:text-green-400">
                          #1 Match
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-lg font-bold ${pattern.color}`}>
                          {pattern.type}
                        </h4>
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {pattern.score}/100
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {pattern.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-muted-foreground text-xs">
            Based on {commits.length.toLocaleString()} commits • Week starts on
            Sunday
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
