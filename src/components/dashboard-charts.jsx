"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function DashboardCharts({ shops, products }) {
  const inStock = products.filter((p) => p.stock_level > 5).length;
  const outOfStock = products.filter((p) => p.stock_level === 0).length;
  const lowStock = products.filter(
    (p) => p.stock_level > 0 && p.stock_level <= 5
  ).length;

  const stockStatus = [
    { name: "In Stock", value: inStock },
    { name: "Out of Stock", value: outOfStock },
    { name: "Low Stock", value: lowStock },
  ];

  //   calculate stock levels for each shop
  const shopStockLevels = shops.map((shop) => ({
    name: shop.name,
    stockLevel: shop.products.reduce(
      (sum, product) => sum + product.stock_level,
      0
    ),
  }));

  //   get top 5 shops by stock level
  const topShops = shopStockLevels
    .sort((a, b) => b.stockLevel - a.stockLevel)
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* chart for showing distribution of stock status */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Stock Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Products",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  name="Products"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* chart for showing top shops by stock level */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Top 5 Shops by Stock Level</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              stockLevel: {
                label: "Stock Level",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topShops}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="stockLevel"
                  fill="var(--color-stockLevel)"
                  name="Stock Level"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
