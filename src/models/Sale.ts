import { Schema, model, models } from "mongoose";

const SaleItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, min: 0 },
  },
  { _id: false }
);

const SaleSchema = new Schema(
  {
    valorTotal: { type: Number, required: true, min: 0 },
    itens: { type: [SaleItemSchema], default: [] },
    paymentMethod: { type: String, default: "" },
  },
  { timestamps: true }
);

SaleSchema.index({ createdAt: 1 });

const Sale = models.Sale || model("Sale", SaleSchema);
export default Sale;
