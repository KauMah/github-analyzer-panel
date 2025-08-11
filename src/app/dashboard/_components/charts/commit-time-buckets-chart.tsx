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
        <CardTitle>When Do You Code?</CardTitle>
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
