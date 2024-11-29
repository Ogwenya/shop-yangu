import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import ProductForm from "@/components/product-form";

export const revalidate = 600;

async function fetchProducts() {
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

const Productspage = async () => {
  const { products, shops } = await fetchProducts();

  return (
    <section>
      <h1 className="text-2xl">Products</h1>
      <div className="mx-auto py-4">
        <DataTable
          columns={columns}
          data={products}
          other_button={<ProductForm shops={shops} />}
        />
      </div>
    </section>
  );
};

export default Productspage;
