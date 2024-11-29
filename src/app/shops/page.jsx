import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ShopForm from "@/components/shop-form";

export const revalidate = 600;

async function fetchShops() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/shops`, {
    headers: {
      "Content-Type": "application/json",
    },
    next: { tags: ["shops"] },
  });
  const data = await response.json();

  if (data.error) {
    throw new Error(data.message);
  }

  return data;
}

const Shopspage = async () => {
  const shops = await fetchShops();

  return (
    <section>
      <h1 className="text-2xl">Shops</h1>
      <div className="mx-auto py-4">
        <DataTable columns={columns} data={shops} other_button={<ShopForm />} />
      </div>
    </section>
  );
};

export default Shopspage;
