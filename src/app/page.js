import DashboardCharts from "@/components/dashboard-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getData() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["products"] },
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }

  return data;
}

export default async function Home() {
  const data = await getData();

  const { products, shops } = data;

  const totalShops = shops.length;
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock_level,
    0
  );
  const totalStock = products.reduce(
    (sum, product) => sum + product.stock_level,
    0
  );

  const metrics = [
    { title: "Total Shops", value: totalShops },
    { title: "Total Products", value: totalProducts },
    {
      title: "Stock Value",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KSH",
      }).format(totalValue),
    },
    { title: "Total Stock", value: totalStock },
  ];

  return (
    <section className="space-y-3">
      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* chart area */}
      <DashboardCharts shops={shops} products={products} />
    </section>
  );
}
