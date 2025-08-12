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

interface CommitTimeHistogramProps {
  commits?: Commit[];
}

export default function CommitTimeHistogram({
  commits = [],
}: CommitTimeHistogramProps) {
  const chartData = useMemo(() => {
    const timeBuckets = [
      { label: 'Early Morning', range: '12:00 AM - 3:59 AM', start: 0, end: 4 },
      { label: 'Dawn', range: '4:00 AM - 7:59 AM', start: 4, end: 8 },
      { label: 'Morning', range: '8:00 AM - 11:59 AM', start: 8, end: 12 },
      { label: 'Afternoon', range: '12:00 PM - 3:59 PM', start: 12, end: 16 },
      { label: 'Evening', range: '4:00 PM - 7:59 PM', start: 16, end: 20 },
      { label: 'Night', range: '8:00 PM - 11:59 PM', start: 20, end: 24 },
    ];

    const bucketCounts = timeBuckets.map((bucket) => ({
      ...bucket,
      commits: 0,
      percentage: 0,
    }));
    commits.forEach((commit) => {
      const localTime = new Date(commit.timestamp);
      const hour = localTime.getHours();

      const bucketIndex = bucketCounts.findIndex(
        (bucket) => hour >= bucket.start && hour < bucket.end
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
      color: '#8b5cf6',
    },
  };

  const mostActiveTime = useMemo(() => {
    return chartData.reduce(
      (max, current) => (current.commits > max.commits ? current : max),
      chartData[0]
    );
  }, [chartData]);

  const topDeveloperProfiles = useMemo(() => {
    if (commits.length === 0) return null;

    const totalCommits = commits.length;
    const earlyMorning = chartData[0].commits;
    const dawn = chartData[1].commits;
    const morning = chartData[2].commits;
    const afternoon = chartData[3].commits;
    const evening = chartData[4].commits;
    const night = chartData[5].commits;

    const earlyTotal = earlyMorning + dawn;
    const workHours = morning + afternoon;
    const nightTotal = night + earlyMorning;
    const allBuckets = [earlyMorning, dawn, morning, afternoon, evening, night];

    const maxCommits = Math.max(...allBuckets);
    const avgCommits = totalCommits / 6;
    const variance =
      allBuckets.reduce((sum, val) => sum + Math.pow(val - avgCommits, 2), 0) /
      6;
    const stdDev = Math.sqrt(variance);

    const profiles = [
      {
        type: 'The Early Riser',
        description:
          'You prefer to code in the early hours, likely before work or right after waking up. This suggests discipline or possibly working across timezones.',
        icon: '🌅',
        color: 'text-orange-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (earlyTotal / totalCommits) * 100 +
              (earlyTotal > workHours ? 20 : 0) +
              (earlyTotal > nightTotal ? 20 : 0)
          )
        ),
      },
      {
        type: 'The 9-to-5er',
        description:
          'Your coding activity peaks during traditional work hours, suggesting office-based or team-driven development work.',
        icon: '💼',
        color: 'text-blue-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (workHours / totalCommits) * 100 +
              (workHours > earlyTotal ? 20 : 0) +
              (workHours > nightTotal ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Night Owl',
        description:
          'You thrive in late-night coding sessions, preferring uninterrupted time for deep work. ',
        icon: '🦉',
        color: 'text-purple-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (nightTotal / totalCommits) * 100 +
              (nightTotal > earlyTotal ? 20 : 0) +
              (nightTotal > workHours ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Burst Coder',
        description:
          'You prefer short, intense, focused coding sessions with sharp peaks in activity followed by quiet periods.',
        icon: '⚡',
        color: 'text-yellow-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (maxCommits / avgCommits) * 20 + (stdDev / avgCommits) * 30
          )
        ),
      },
      {
        type: 'The Marathoner',
        description:
          'You maintain consistent coding activity throughout the day, suggesting flexible hours or always-on availability.',
        icon: '🏃',
        color: 'text-green-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (1 - stdDev / avgCommits) * 50 +
              (maxCommits < avgCommits * 2 ? 30 : 0)
          )
        ),
      },
      {
        type: 'The Split-Shift Hacker',
        description:
          'You have two distinct coding peaks - one in the morning and one late at night, possibly indicating day-job + night project work.',
        icon: '🔄',
        color: 'text-indigo-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (morning > avgCommits * 1.5 ? 30 : 0) +
              (night > avgCommits * 1.5 ? 30 : 0) +
              (afternoon < avgCommits * 0.8 ? 20 : 0) +
              (Math.abs(morning - night) < avgCommits * 0.5 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Deadline Sprinter',
        description:
          'You often push code late at night, suggesting last-minute deliveries or hackathon-style crunch periods.',
        icon: '🏁',
        color: 'text-red-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (night / maxCommits) * 50 +
              (night > avgCommits * 2 ? 30 : 0) +
              (night > evening ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Side Project Guy',
        description:
          'You code almost exclusively outside of traditional work hours, likely balancing a day job with passionate side projects and personal coding time.',
        icon: '🚀',
        color: 'text-emerald-600',
        score: Math.min(
          100,
          Math.max(
            0,
            ((earlyTotal + evening + night) / totalCommits) * 100 -
              (workHours / totalCommits) * 50
          )
        ),
      },
      {
        type: 'The Adaptive Coder',
        description:
          'Your coding patterns show flexibility across different times of day, adapting to various schedules and project needs.',
        icon: '🎯',
        color: 'text-gray-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (1 - Math.abs(stdDev / avgCommits - 1)) * 50 +
              (allBuckets.filter((bucket) => bucket > avgCommits * 0.5).length /
                6) *
                50
          )
        ),
      },
      {
        type: 'The Weekend Warrior',
        description:
          'You do most of your coding on weekends, suggesting a busy weekday schedule with dedicated weekend development time.',
        icon: '🏖️',
        color: 'text-cyan-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (evening / totalCommits) * 60 +
              (night / totalCommits) * 40 +
              (workHours < avgCommits * 0.7 ? 30 : 0)
          )
        ),
      },
      {
        type: 'The Lunch Break Coder',
        description:
          'You squeeze in coding during lunch hours and short breaks, showing dedication to continuous learning and development.',
        icon: '🥪',
        color: 'text-amber-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (afternoon / totalCommits) * 80 +
              (afternoon > morning ? 20 : 0) +
              (afternoon > evening ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Remote Worker',
        description:
          'Your coding is spread across flexible hours with peaks in morning and afternoon, typical of remote work arrangements.',
        icon: '🏠',
        color: 'text-teal-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (morning / totalCommits) * 40 +
              (afternoon / totalCommits) * 40 +
              (evening / totalCommits) * 20 +
              (Math.abs(morning - afternoon) < avgCommits * 0.3 ? 30 : 0)
          )
        ),
      },
      {
        type: 'The Freelancer',
        description:
          'Your coding shows irregular patterns with bursts of activity at various times, typical of project-based freelance work.',
        icon: '💻',
        color: 'text-pink-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (stdDev / avgCommits) * 40 +
              (maxCommits > avgCommits * 2 ? 30 : 0) +
              (allBuckets.filter((bucket) => bucket > 0).length >= 4 ? 30 : 0)
          )
        ),
      },
      {
        type: 'The Startup Founder',
        description:
          'You code at all hours with high variability, showing the "always on" mentality typical of early-stage startup founders.',
        icon: '🚀',
        color: 'text-rose-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (allBuckets.filter((bucket) => bucket > 0).length / 6) * 50 +
              (maxCommits > avgCommits * 1.5 ? 30 : 0) +
              (night > avgCommits * 0.5 ? 20 : 0)
          )
        ),
      },
      {
        type: 'The Consultant',
        description:
          'Your coding peaks during business hours with occasional evening work, typical of client-focused consulting work.',
        icon: '📊',
        color: 'text-slate-600',
        score: Math.min(
          100,
          Math.max(
            0,
            (workHours / totalCommits) * 70 +
              (evening / totalCommits) * 30 +
              (morning > night ? 20 : 0)
          )
        ),
      },
    ];

    const topProfiles = profiles
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((profile) => ({
        ...profile,
        score: Math.round(profile.score),
      }));
    console.log(profiles);

    return topProfiles;
  }, [chartData, commits.length]);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (!commits.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commit Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            No commit data available. Start making commits to see your activity
            patterns!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time of Day Patterns</CardTitle>
        <p className="text-muted-foreground text-sm">
          Commit distribution throughout the day ({userTimezone})
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
                dataKey="label"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
                      <p className="font-semibold">{label}</p>
                      <p className="text-muted-foreground text-sm">
                        {data?.range}
                      </p>
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
                      entry.commits === mostActiveTime.commits
                        ? '#7c3aed'
                        : '#a78bfa'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {mostActiveTime.label}
            </div>
            <p className="text-muted-foreground text-sm">Most Active Time</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {mostActiveTime.range}
            </p>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {mostActiveTime.commits}
            </div>
            <p className="text-muted-foreground text-sm">Peak Commits</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {mostActiveTime.percentage}% of total
            </p>
          </div>

          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {chartData.filter((bucket) => bucket.commits > 0).length}
            </div>
            <p className="text-muted-foreground text-sm">Active Time Periods</p>
            <p className="text-muted-foreground mt-1 text-xs">
              out of 6 total periods
            </p>
          </div>
        </div>

        {topDeveloperProfiles && (
          <div className="mt-6">
            <h3 className="mb-4 text-center text-lg font-semibold">
              Your Top Developer Profiles
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {topDeveloperProfiles.map((profile, index) => (
                <div
                  key={profile.type}
                  className={`rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800 ${
                    index === 0
                      ? 'ring-2 ring-purple-200 dark:ring-purple-800'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`text-2xl ${profile.color}`}>
                        {profile.icon}
                      </div>
                      {index === 0 && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600 dark:bg-purple-900 dark:text-purple-400">
                          #1 Match
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-lg font-bold ${profile.color}`}>
                          {profile.type}
                        </h4>
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          {profile.score}/100
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {profile.description}
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
            Based on {commits.length.toLocaleString()} commits • Times shown in
            your local timezone
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
