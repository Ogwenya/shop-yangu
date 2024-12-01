import { NextResponse } from "next/server";
import os from "os";
import { promises as fs } from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import { delete_image, upload_image } from "@/lib/file-operations";
import Shop from "@/lib/models/shopModel";
import Product from "@/lib/models/productModel";

//###############################
// ########## GET SHOP ##########
//###############################
export async function GET(request, { params }) {
  const id = params.id;

  try {
    await connectDB();

    // get shop details
    const shop = await Shop.findById(id).populate("products");

    if (!shop) {
      return NextResponse.json(
        { error: true, message: "Shop not found" },
        { status: 404 }
      );
    }

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
    await connectDB();

    const formData = await request.formData();

    const id = params.id;
    const name = formData.get("name");
    const description = formData.get("description");
    const logo = formData.get("logo");

    // Get existing shop to check current logo
    const existing_shop = await Shop.findById(id);

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
    const updated_shop = await Shop.findByIdAndUpdate(id, {
      name,
      description,
      logo: logo_url,
      logo_public_id,
    });

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
    await connectDB();

    const id = params.id;

    // Check if shop exists
    const existing_shop = await Shop.findById(id).populate("products");

    if (!existing_shop) {
      return NextResponse.json({
        error: true,
        message: "Shop not found",
      });
    }

    // Check if shop has any products
    const products_count = existing_shop.products.length;

    if (products_count > 0) {
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
    await Shop.findByIdAndDelete(id);

    return NextResponse.json({ message: "Shop deleted successfully" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}
