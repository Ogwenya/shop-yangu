import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { openDb } from "@/lib/db";

//#####################################
// ########## FIND ALL SHOPS ##########
//#####################################
export async function GET() {
  try {
    const db = await openDb();

    const shops = await db.all(`
      SELECT shop.*, COUNT(product.id) as products_count 
      FROM shop
      LEFT JOIN product ON shop.id = product.shop_id
      GROUP BY shop.id
    `);

    return NextResponse.json(shops);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}

//##################################
// ########## CREATE SHOP ##########
//##################################
export async function POST(request) {
  try {
    const db = await openDb();

    const data = await request.formData();

    const name = data.get("name");
    const description = data.get("description");

    // Check if shop name already exists
    const existing_shop = await db.get("SELECT * FROM shop WHERE name = ?", [
      name,
    ]);

    if (existing_shop) {
      return NextResponse.json({
        error: true,
        message: "A shop with this name already exists",
      });
    }

    const logo = data.get("logo");

    const logo_data = logo ? await logo.arrayBuffer() : null;

    // Create uploads directory if it doesn't exist
    const uploads_dir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploads_dir)) {
      fs.mkdirSync(uploads_dir, { recursive: true });
    }

    // Save logo if provided
    let logo_filename = "default-shop.svg";
    if (logo) {
      logo_filename = `${Date.now()}-${logo.name}`;
      const logo_path = path.join(uploads_dir, logo_filename);
      fs.writeFileSync(logo_path, Buffer.from(logo_data));
    }

    // Save shop to database
    await db.run(
      "INSERT INTO shop (name, description, logo) VALUES (?, ?, ?)",
      [name, description, `/uploads/${logo_filename}`]
    );

    const shop = await db.get("SELECT * FROM shop WHERE name = ?", [name]);

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}
