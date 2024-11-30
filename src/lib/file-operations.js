import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function upload_image(file) {
  try {
    const image = await cloudinary.v2.uploader.upload(
      file,
      { folder: "shop_yangu" },
      (result) => result
    );

    return image;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function delete_image(public_id) {
  const image = await cloudinary.v2.uploader.destroy(public_id);

  return image;
}
