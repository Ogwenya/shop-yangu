import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ProductForm from "@/components/product-form";

async function getData(id) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/shops/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: [`shop-${id}`] },
  });
  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }

  return data;
}

export default async function ShopDetails({ params }) {
  const shop = await getData(params.id);

  return (
    <section>
      <h1 className="text-2xl">{shop.name}</h1>
      <div className="mx-auto py-4">
        <DataTable
          columns={columns}
          data={shop.products}
          other_button={<ProductForm shop_id={shop.id} shop_name={shop.name} />}
        />
      </div>
    </section>
  );
}
