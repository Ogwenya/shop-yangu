import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { openDb } from "@/lib/db";

//###############################
// ########## GET SHOP ##########
//###############################
export async function GET(request, { params }) {
  const id = params.id;

  try {
    const db = await openDb();

    // get shop details
    const shop = await db.get(
      `SELECT shop.*, COUNT(product.id) as products_count 
       FROM shop 
       LEFT JOIN product ON shop.id = product.shop_id 
       WHERE shop.id = ? 
       GROUP BY shop.id`,
      [id]
    );

    if (!shop) {
      return NextResponse.json(
        { error: true, message: "Shop not found" },
        { status: 404 }
      );
    }

    // Get all products for this shop
    const products = await db.all(`SELECT * FROM product WHERE shop_id = ?`, [
      id,
    ]);

    // Add products to shop object
    shop.products = products;

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}

//##################################
// ########## UPDATE SHOP ##########
//##################################
export async function PATCH(request, { params }) {
  try {
    const db = await openDb();

    const formData = await request.formData();

    const id = params.id;
    const name = formData.get("name");
    const description = formData.get("description");
    const logo = formData.get("logo");

    // Get existing shop to check current logo
    const existing_shop = await db.get("SELECT * FROM shop WHERE id = ?", [id]);

    if (!existing_shop) {
      throw new Error("Shop not found");
    }

    let logo_path = existing_shop.logo;

    // if new logo is provided, delete the previous one
    if (logo) {
      const uploads_dir = path.join(process.cwd(), "public/uploads");

      // Delete old logo if it's not the default
      if (!existing_shop.logo.includes("default-shop.svg")) {
        const old_logo_path = path.join(
          process.cwd(),
          "public",
          existing_shop.logo
        );
        fs.unlinkSync(old_logo_path);
      }

      // Save new logo
      const logo_data = await logo.arrayBuffer();
      const logo_filename = `${Date.now()}-${logo.name}`;
      logo_path = `/uploads/${logo_filename}`;

      const new_logo_path = path.join(uploads_dir, logo_filename);
      fs.writeFileSync(new_logo_path, Buffer.from(logo_data));
    }

    // Update shop in database
    await db.run(
      "UPDATE shop SET name = ?, description = ?, logo = ? WHERE id = ?",
      [name, description, logo_path, id]
    );

    const updated_shop = await db.get("SELECT * FROM shop WHERE id = ?", [id]);

    return NextResponse.json(updated_shop);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}

//##################################
// ########## DELETE SHOP #########
//##################################
export async function DELETE(request, { params }) {
  try {
    const db = await openDb();

    const id = params.id;

    // Check if shop exists
    const existing_shop = await db.get("SELECT * FROM shop WHERE id = ?", [id]);

    if (!existing_shop) {
      return NextResponse.json({
        error: true,
        message: "Shop not found",
      });
    }

    // Check if shop has any products
    const products_count = await db.get(
      "SELECT COUNT(*) as count FROM product WHERE shop_id = ?",
      [id]
    );

    if (products_count.count > 0) {
      return NextResponse.json({
        error: true,
        message: "Cannot delete shop with existing products",
      });
    }

    // Delete shop logo if not default
    if (!existing_shop.logo.includes("default-shop.svg")) {
      const logo_path = path.join(process.cwd(), "public", existing_shop.logo);
      fs.unlinkSync(logo_path);
    }

    // Delete shop from database
    await db.run("DELETE FROM shop WHERE id = ?", [id]);

    return NextResponse.json({ message: "Shop deleted successfully" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}
