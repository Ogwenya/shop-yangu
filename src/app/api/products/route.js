import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { connectDB } from "@/lib/db";
import { upload_image } from "@/lib/file-operations";
import Product from "@/lib/models/productModel";
import Shop from "@/lib/models/shopModel";
//########################################
// ########## FIND ALL PRODUCTS ##########
//########################################
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({}).populate("shop_id");

    const shops = await Shop.find({}).populate("products");

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
    await connectDB();

    const data = await request.formData();

    const name = data.get("name");
    const description = data.get("description");
    const price = data.get("price");
    const stock_level = data.get("stock_level");
    const shop_id = data.get("shop_id");
    const image = data.get("image");

    // Check if product name already exists
    const existing_product = await Product.findOne({ name });

    if (existing_product) {
      return NextResponse.json({
        error: true,
        message: "A product with this name already exists",
      });
    }

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

    const image_url = result.secure_url;
    const image_public_id = result.public_id;

    const product = await Product.create({
      name,
      description,
      price,
      stock_level,
      shop_id,
      image: image_url,
      image_public_id,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}
