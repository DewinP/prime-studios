"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, Users, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const FILTERS = [
  { label: "7 days", value: "week" },
  { label: "30 days", value: "month" },
  { label: "Year", value: "year" },
];

const summary = {
  revenue: 125000,
  purchases: 320,
  growth: 4.5,
  trending: 12.5,
};

const revenueDataWeek = [
  { label: "Mon", value: 20 },
  { label: "Tue", value: 40 },
  { label: "Wed", value: 30 },
  { label: "Thu", value: 50 },
  { label: "Fri", value: 70 },
  { label: "Sat", value: 60 },
  { label: "Sun", value: 80 },
];
const revenueDataMonth = [
  { label: "W1", value: 180 },
  { label: "W2", value: 220 },
  { label: "W3", value: 160 },
  { label: "W4", value: 240 },
];
const revenueDataYear = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 210 },
  { label: "Mar", value: 80 },
  { label: "Apr", value: 160 },
  { label: "May", value: 240 },
  { label: "Jun", value: 180 },
  { label: "Jul", value: 200 },
  { label: "Aug", value: 170 },
  { label: "Sep", value: 220 },
  { label: "Oct", value: 250 },
  { label: "Nov", value: 210 },
  { label: "Dec", value: 260 },
];

const latestPayments = [
  {
    date: "2024-06-29",
    user: "alice@email.com",
    track: "Track A",
    amount: 2500,
    status: "succeeded",
  },
  {
    date: "2024-06-28",
    user: "bob@email.com",
    track: "Track B",
    amount: 1500,
    status: "succeeded",
  },
  {
    date: "2024-06-28",
    user: "carol@email.com",
    track: "Track C",
    amount: 2000,
    status: "failed",
  },
  {
    date: "2024-06-27",
    user: "dave@email.com",
    track: "Track D",
    amount: 3000,
    status: "succeeded",
  },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState("month");
  let chartData = revenueDataMonth;
  if (filter === "week") chartData = revenueDataWeek;
  if (filter === "year") chartData = revenueDataYear;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CreditCard className="text-primary h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${(summary.revenue / 100).toLocaleString()}
            </div>
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />+
              {summary.trending}% this month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Purchases</CardDescription>
            <Users className="text-primary h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.purchases}</div>
            <div className="text-muted-foreground mt-2 text-sm">All time</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Growth Rate</CardDescription>
            <BarChart2 className="text-primary h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.growth}%</div>
            <div className="text-muted-foreground mt-2 text-sm">
              Steady performance
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Trending</CardDescription>
            <TrendingUp className="text-primary h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{summary.trending}%</div>
            <div className="text-muted-foreground mt-2 text-sm">This month</div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue/Purchases Chart */}
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Purchases Over Time</CardTitle>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "default" : "outline"}
                className={filter === f.value ? "bg-primary text-white" : ""}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={chartData}
              margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10b981" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Latest Payments Table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Latest Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="divide-border min-w-full divide-y">
              <thead>
                <tr className="text-muted-foreground text-xs uppercase">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Track</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {latestPayments.map((p, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-2 whitespace-nowrap">{p.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.user}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{p.track}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      ${(p.amount / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge
                        variant={
                          p.status === "succeeded" ? "default" : "destructive"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
