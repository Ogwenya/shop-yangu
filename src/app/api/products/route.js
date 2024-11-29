import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { openDb } from "@/lib/db";

//########################################
// ########## FIND ALL PRODUCTS ##########
//########################################
export async function GET() {
  try {
    const db = await openDb();

    const products = await db.all(`
      SELECT product.*, shop.name as shop_name 
      FROM product
      LEFT JOIN shop ON shop.id = product.shop_id
    `);

    const shops = await db.all(`SELECT * FROM shop`);

    return NextResponse.json({ products, shops });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}

//#####################################
// ########## CREATE PRODUCT ##########
//#####################################
export async function POST(request) {
  try {
    const db = await openDb();

    const data = await request.formData();

    const name = data.get("name");
    const description = data.get("description");
    const price = data.get("price");
    const stock_level = data.get("stock_level");
    const shop_id = data.get("shop_id");
    const image = data.get("image");

    // Check if product name already exists
    const existing_product = await db.get(
      "SELECT * FROM product WHERE name = ?",
      [name]
    );

    if (existing_product) {
      return NextResponse.json({
        error: true,
        message: "A product with this name already exists",
      });
    }

    // Create uploads directory if it doesn't exist
    const uploads_dir = path.join(process.cwd(), "public/uploads");

    const image_data = await image.arrayBuffer();

    // Save image
    const image_filename = `${Date.now()}-${image.name}`;
    const image_path = path.join(uploads_dir, image_filename);
    fs.writeFileSync(image_path, Buffer.from(image_data));

    await db.run(
      "INSERT INTO product (name, description, price, stock_level, shop_id, image) VALUES (?, ?, ?, ?, ?, ?)",
      [
        name,
        description,
        price,
        stock_level,
        shop_id,
        `/uploads/${image_filename}`,
      ]
    );

    const product = await db.get("SELECT * FROM product WHERE name = ?", [
      name,
    ]);

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}
