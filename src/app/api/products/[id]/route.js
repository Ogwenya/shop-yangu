import { NextResponse } from "next/server";
import os from "os";
import { promises as fs } from "fs";
import path from "path";
import { openDb } from "@/lib/db";
import { delete_image, upload_image } from "@/lib/file-operations";

//##################################
// ########## UPDATE PRODUCT ##########
//##################################
export async function PATCH(request, { params }) {
  try {
    const db = await openDb();

    const id = params.id;

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock_level = formData.get("stock_level");
    const shop_id = formData.get("shop_id");
    const image = formData.get("image");

    // Get existing product to check current image
    const existing_product = await db.get(
      "SELECT * FROM product WHERE id = ?",
      [id]
    );

    if (!existing_product) {
      throw new Error("Product not found");
    }

    let image_url = existing_product.image;
    let image_public_id = existing_product.image_public_id;

    if (image) {
      // Generate unique temp file path
      const tempPath = path.join(
        os.tmpdir(),
        `upload_${Date.now()}_${image.name}`
      );

      // Write file buffer to temp location
      const fileBuffer = await image.arrayBuffer();
      await fs.writeFile(tempPath, Buffer.from(fileBuffer));

      // Upload temp file
      const result = await upload_image(tempPath);

      // Clean up temp file
      await fs.unlink(tempPath);

      if (result.error) {
        throw new Error(result.message);
      }

      image_url = result.secure_url;
      image_public_id = result.public_id;

      // Delete previous image
      await delete_image(existing_product.image_public_id);
    }

    // Update shop in database
    await db.run(
      "UPDATE product SET name = ?, description = ?, image = ?, image_public_id = ?, price = ?, stock_level = ?, shop_id = ? WHERE id = ?",
      [
        name,
        description,
        image_url,
        image_public_id,
        price,
        stock_level,
        shop_id,
        id,
      ]
    );

    const updated_product = await db.get("SELECT * FROM product WHERE id = ?", [
      id,
    ]);

    return NextResponse.json(updated_product);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}

//##################################
// ########## DELETE PRODUCT #########
//##################################
export async function DELETE(request, { params }) {
  try {
    const db = await openDb();

    const id = params.id;

    // Check if product exists
    const existing_product = await db.get(
      "SELECT * FROM product WHERE id = ?",
      [id]
    );

    if (!existing_product) {
      return NextResponse.json({
        error: true,
        message: "Product not found",
      });
    }

    // Delete product image
    await delete_image(existing_product.image_public_id);

    // Delete product from database
    await db.run("DELETE FROM product WHERE id = ?", [id]);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}
