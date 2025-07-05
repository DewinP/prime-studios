"use client";

import { AdminTrackList } from "@/components/admin-track-list";
import { UploadTrackModal } from "@/components/shared/modals/upload-track-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import type { UploadTrackData } from "@/components/shared/modals/upload-track-modal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const revenueDataWeek = [
  { label: "Mon", revenue: 200 },
  { label: "Tue", revenue: 400 },
  { label: "Wed", revenue: 300 },
  { label: "Thu", revenue: 500 },
  { label: "Fri", revenue: 700 },
  { label: "Sat", revenue: 600 },
  { label: "Sun", revenue: 800 },
];

const revenueDataMonth = [
  { label: "W1", revenue: 1800 },
  { label: "W2", revenue: 2200 },
  { label: "W3", revenue: 1600 },
  { label: "W4", revenue: 2400 },
];

const revenueDataYear = [
  { label: "Jan", revenue: 1200 },
  { label: "Feb", revenue: 2100 },
  { label: "Mar", revenue: 800 },
  { label: "Apr", revenue: 1600 },
  { label: "May", revenue: 2400 },
  { label: "Jun", revenue: 1800 },
  { label: "Jul", revenue: 2000 },
  { label: "Aug", revenue: 1700 },
  { label: "Sep", revenue: 2200 },
  { label: "Oct", revenue: 2500 },
  { label: "Nov", revenue: 2100 },
  { label: "Dec", revenue: 2600 },
];

const performerData = [
  { name: "Track A", revenue: 3200 },
  { name: "Track B", revenue: 2100 },
  { name: "Track C", revenue: 1800 },
  { name: "Track D", revenue: 900 },
];

const FILTERS = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

export default function DashboardAnalyticsPage() {
  const [filter, setFilter] = useState("month");
  const { data: payments } = api.payment.getPaymentHistory.useQuery();
  const totalRevenue =
    payments?.reduce(
      (sum, p) => (p.status === "succeeded" ? sum + p.amount : sum),
      0,
    ) ?? 0;

  let revenueData = revenueDataMonth;
  if (filter === "week") revenueData = revenueDataWeek;
  if (filter === "year") revenueData = revenueDataYear;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <Card className="from-primary/10 to-secondary/10 border-primary/20 flex-1 bg-gradient-to-r">
          <CardHeader>
            <CardTitle className="text-primary">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-primary text-3xl font-bold">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 flex-1">
          <CardHeader>
            <CardTitle className="text-secondary">Best Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={performerData}
                margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-primary">Revenue Over Time</CardTitle>
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
              data={revenueData}
              margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10b981" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
