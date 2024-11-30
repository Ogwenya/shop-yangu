import { NextResponse } from "next/server";
import os from "os";
import { promises as fs } from "fs";
import path from "path";
import { openDb } from "@/lib/db";
import { delete_image, upload_image } from "@/lib/file-operations";

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

    let logo_url = existing_shop.logo;
    let logo_public_id = existing_shop.logo_public_id;

    if (logo) {
      // Generate unique temp file path
      const tempPath = path.join(
        os.tmpdir(),
        `upload_${Date.now()}_${logo.name}`
      );

      // Write file buffer to temp location
      const fileBuffer = await logo.arrayBuffer();
      await fs.writeFile(tempPath, Buffer.from(fileBuffer));

      // Upload temp file
      const result = await upload_image(tempPath);

      // Clean up temp file
      await fs.unlink(tempPath);

      if (result.error) {
        throw new Error(result.message);
      }

      logo_url = result.secure_url;
      logo_public_id = result.public_id;

      // Delete previous logo if not default
      const DEFAULT_IMAGE_PUBLIC_ID = process.env.DEFAULT_IMAGE_PUBLIC_ID;

      if (existing_shop.logo_public_id !== DEFAULT_IMAGE_PUBLIC_ID) {
        await delete_image(existing_shop.logo_public_id);
      }
    }

    // Update shop in database
    await db.run(
      "UPDATE shop SET name = ?, description = ?, logo = ?, logo_public_id = ? WHERE id = ?",
      [name, description, logo_url, logo_public_id, id]
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

    // Delete previous logo if not default
    const DEFAULT_IMAGE_PUBLIC_ID = process.env.DEFAULT_IMAGE_PUBLIC_ID;

    if (existing_shop.logo_public_id !== DEFAULT_IMAGE_PUBLIC_ID) {
      await delete_image(existing_shop.logo_public_id);
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
