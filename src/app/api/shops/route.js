import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { connectDB } from "@/lib/db";
import { upload_image } from "@/lib/file-operations";
import Shop from "@/lib/models/shopModel";
import Product from "@/lib/models/productModel";

//#####################################
// ########## FIND ALL SHOPS ##########
//#####################################
export async function GET() {
  try {
    await connectDB();
    const shops = await Shop.find({}).populate("products");

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
    await connectDB();

    const data = await request.formData();

    const name = data.get("name");
    const description = data.get("description");
    const logo = data.get("logo");

    // Check if shop name already exists
    const existing_shop = await Shop.findOne({ name });

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
    const shop = await Shop.create({
      name,
      description,
      logo_public_id,
      logo: logo_url,
    });

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error.message,
    });
  }
}
