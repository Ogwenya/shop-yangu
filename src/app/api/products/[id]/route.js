import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { openDb } from "@/lib/db";

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

    let image_path = existing_product.image;

    // if new image is provided, delete the previous one
    if (image) {
      // Delete old image if it's not the default
      const old_image_path = path.join(
        process.cwd(),
        "public",
        existing_product.image
      );
      fs.unlinkSync(old_image_path);

      // Save new image
      const uploads_dir = path.join(process.cwd(), "public/uploads");
      const image_data = await image.arrayBuffer();
      const image_filename = `${Date.now()}-${image.name}`;
      image_path = `/uploads/${image_filename}`;

      const new_image_path = path.join(uploads_dir, image_filename);
      fs.writeFileSync(new_image_path, Buffer.from(image_data));
    }

    // Update shop in database
    await db.run(
      "UPDATE product SET name = ?, description = ?, image = ?, price = ?, stock_level = ?, shop_id = ? WHERE id = ?",
      [name, description, image_path, price, stock_level, shop_id, id]
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
    const image_path = path.join(
      process.cwd(),
      "public",
      existing_product.image
    );
    fs.unlinkSync(image_path);

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
