"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  TrendingUp,
  Users,
  BarChart2,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { api } from "@/trpc/react";

export default function DashboardPage() {
  const { data: analytics, isLoading } = api.order.getOrderAnalytics.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">No data available</div>
      </div>
    );
  }

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
              $
              {analytics.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              {/* You can add a trending/growth metric here if you want */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Purchases</CardDescription>
            <Users className="text-primary h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalPurchases}</div>
            <div className="text-muted-foreground mt-2 text-sm">All time</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Avg Order Value</CardDescription>
            <BarChart2 className="text-primary h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {analytics.totalPurchases > 0
                ? (
                    analytics.totalRevenue / analytics.totalPurchases
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </div>
            <div className="text-muted-foreground mt-2 text-sm">
              Steady performance
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>This Week</CardDescription>
            <Calendar className="text-primary h-6 w-6" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              $
              {analytics.revenueByDay
                .slice(-7)
                .reduce((sum, day) => sum + day.revenue, 0)
                .toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </div>
            <div className="text-muted-foreground mt-2 text-sm">
              Last 7 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue/Purchases Chart */}
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={analytics.revenueByDay.map((day) => ({
                label: day.date,
                value: day.revenue,
              }))}
              margin={{ top: 16, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
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

      {/* Latest Orders Table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Latest Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="divide-border min-w-full divide-y">
              <thead>
                <tr className="text-muted-foreground text-xs uppercase">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Items</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.latestOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {order.billingEmail}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge
                        variant={
                          order.status === "paid" ? "default" : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {analytics.latestOrders.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                No orders yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
