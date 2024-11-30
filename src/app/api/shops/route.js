import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { openDb } from "@/lib/db";
import { upload_image } from "@/lib/file-operations";

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
    const logo = data.get("logo");

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

    const DEFAULT_IMAGE_PUBLIC_ID = process.env.DEFAULT_IMAGE_PUBLIC_ID;
    const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

    let logo_public_id;
    let logo_url;

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
    } else {
      logo_public_id = DEFAULT_IMAGE_PUBLIC_ID;
      logo_url = DEFAULT_IMAGE;
    }

    // Save shop to database
    await db.run(
      "INSERT INTO shop (name, description, logo_public_id, logo) VALUES (?, ?, ?, ?)",
      [name, description, logo_public_id, logo_url]
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
