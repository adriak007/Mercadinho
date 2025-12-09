import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    barcode: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    unit: { type: String, trim: true, default: "un" },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    notes: { type: String, default: "" },
    tracksStock: { type: Boolean, default: true },
    allowInvoice: { type: Boolean, default: false },
    hasVariations: { type: Boolean, default: false },
    hasComposition: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", code: 1, barcode: 1 });

const Product = models.Product || model("Product", ProductSchema);
export default Product;
