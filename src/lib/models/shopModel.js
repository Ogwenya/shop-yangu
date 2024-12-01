import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "shop name is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "shop description is required"],
    },
    logo: {
      type: String,
      default: process.env.DEFAULT_IMAGE,
    },
    logo_public_id: {
      type: String,
      default: process.env.DEFAULT_IMAGE_PUBLIC_ID,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

shopSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "shop_id",
  justOne: false,
});

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);

export default Shop;
