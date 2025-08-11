'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { format, subDays, startOfDay, endOfDay, isSameDay } from 'date-fns';

interface Commit {
  repo: string;
  username: string;
  hash: string;
  timestamp: Date;
  files: number;
  linesAdded: number;
  linesDeleted: number;
}

interface CommitLineChartProps {
  commits?: Commit[];
}

export function CommitLineChart({ commits = [] }: CommitLineChartProps) {
  const [dateRange, setDateRange] = useState(() => {
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(new Date(), 13));
    return { startDate, endDate };
  });

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const filteredCommits = useMemo(() => {
    return commits.filter((commit) => {
      const commitDate = new Date(commit.timestamp);
      return (
        commitDate >= dateRange.startDate && commitDate <= dateRange.endDate
      );
    });
  }, [commits, dateRange]);

  const chartData = useMemo(() => {
    type DayData = {
      date: Date;
      commits: number;
      linesAdded: number;
      linesDeleted: number;
      filesChanged: number;
    };
    const daysData: Record<string, DayData> = {};

    const currentDate = new Date(dateRange.startDate);
    while (currentDate <= dateRange.endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      daysData[dateKey] = {
        date: new Date(currentDate),
        commits: 0,
        linesAdded: 0,
        linesDeleted: 0,
        filesChanged: 0,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    filteredCommits.forEach((commit) => {
      const date = new Date(commit.timestamp);
      const dateKey = date.toISOString().split('T')[0];

      if (daysData[dateKey]) {
        daysData[dateKey].commits += 1;
        daysData[dateKey].linesAdded += commit.linesAdded;
        daysData[dateKey].linesDeleted += commit.linesDeleted;
        daysData[dateKey].filesChanged += commit.files;
      }
    });

    return Object.values(daysData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredCommits, dateRange]);

  const chartConfig = {
    commits: {
      label: 'Commits',
      theme: {
        light: '#3b82f6',
        dark: '#60a5fa',
      },
    },
  };

  const linesChartConfig = {
    linesAdded: {
      label: 'Lines Added',
      theme: {
        light: '#10b981',
        dark: '#34d399',
      },
    },
    linesDeleted: {
      label: 'Lines Deleted',
      theme: {
        light: '#ef4444',
        dark: '#f87171',
      },
    },
  };

  const handleDateRangeChange = (days: number) => {
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(new Date(), days - 1));
    setDateRange({ startDate, endDate });
  };

  const isCurrentRange = (days: number) => {
    const expectedStart = startOfDay(subDays(new Date(), days - 1));
    const expectedEnd = endOfDay(new Date());
    return (
      isSameDay(dateRange.startDate, expectedStart) &&
      isSameDay(dateRange.endDate, expectedEnd)
    );
  };

  if (!commits.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commit Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground py-8 text-center">
            No commit data available. Start making commits to see your activity!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Commits per Calendar Day</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={isCurrentRange(7) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(7)}
            >
              7 days
            </Button>
            <Button
              variant={isCurrentRange(14) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(14)}
            >
              14 days
            </Button>
            <Button
              variant={isCurrentRange(30) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(30)}
            >
              30 days
            </Button>
            <Button
              variant={isCurrentRange(90) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(90)}
            >
              90 days
            </Button>
            <Button
              variant={isCurrentRange(180) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(180)}
            >
              180 days
            </Button>
            <Button
              variant={isCurrentRange(365) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange(365)}
            >
              1 year
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const endDate = endOfDay(new Date());
                const startDate = startOfDay(new Date(0));
                setDateRange({ startDate, endDate });
              }}
            >
              All time
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {format(dateRange.startDate, 'MMM d, yyyy')} -{' '}
            {format(dateRange.endDate, 'MMM d, yyyy')}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Commits Chart */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Commits & Activity</h3>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart
                data={chartData}
                onMouseMove={(data) => {
                  if (data && data.activeLabel) {
                    setHoveredDate(data.activeLabel);
                  }
                }}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.3}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  label={{
                    value: 'Number of Commits',
                    angle: -90,
                    position: 'insideLeft',
                    style: {
                      textAnchor: 'middle',
                      fontSize: 14,
                      fontWeight: 500,
                    },
                  }}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    return (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        labelFormatter={(value) =>
                          !!label
                            ? format(new Date(label), 'MMM d, yyyy')
                            : value
                        }
                      />
                    );
                  }}
                />
                <ChartLegend
                  content={({ payload }) => (
                    <ChartLegendContent payload={payload} />
                  )}
                />
                <Bar
                  dataKey="commits"
                  fill="var(--color-commits)"
                  radius={[4, 4, 0, 0]}
                  opacity={hoveredDate ? 0.3 : 1}
                />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Lines Chart */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Lines Added vs Removed
            </h3>
            <ChartContainer config={linesChartConfig} className="h-[300px]">
              <BarChart
                data={chartData}
                onMouseMove={(data) => {
                  if (data && data.activeLabel) {
                    setHoveredDate(data.activeLabel);
                  }
                }}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.3}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  label={{
                    value: 'Lines of Code',
                    angle: -90,
                    position: 'insideLeft',
                    style: {
                      textAnchor: 'middle',
                      fontSize: 14,
                      fontWeight: 500,
                    },
                  }}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    return (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        labelFormatter={(value) =>
                          !!label
                            ? format(new Date(label), 'MMM d, yyyy')
                            : value
                        }
                      />
                    );
                  }}
                />
                <ChartLegend
                  content={({ payload }) => (
                    <ChartLegendContent payload={payload} />
                  )}
                />
                <Bar
                  dataKey="linesAdded"
                  fill="var(--color-linesAdded)"
                  radius={[4, 4, 0, 0]}
                  opacity={hoveredDate ? 0.3 : 1}
                />
                <Bar
                  dataKey="linesDeleted"
                  fill="var(--color-linesDeleted)"
                  radius={[4, 4, 0, 0]}
                  opacity={hoveredDate ? 0.3 : 1}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredCommits.length.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Commits in Range</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredCommits
                .reduce((sum, commit) => sum + commit.linesAdded, 0)
                .toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              Lines Added in Range
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
