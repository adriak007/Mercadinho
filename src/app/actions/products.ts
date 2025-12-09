"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Sale from "@/models/Sale";
import type { ActionState } from "@/types/actions";
import type { ProductDetail, ProductListItem, SaleItem } from "@/types/products";

type ProductDocLean = {
  _id: unknown;
  name: string;
  code: string;
  barcode?: string;
  category?: string;
  unit?: string;
  price?: number;
  cost?: number;
  stock?: number;
  notes?: string;
  tracksStock?: boolean;
  allowInvoice?: boolean;
  hasVariations?: boolean;
  hasComposition?: boolean;
};

function fail(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { ok: false, message, fieldErrors };
}

function success(message: string): ActionState {
  return { ok: true, message };
}

export async function listProducts(): Promise<ProductListItem[]> {
  await connectToDatabase();
  const products = (await Product.find().sort({ createdAt: -1 }).lean()) as unknown as ProductDocLean[];
  return products.map((p) => ({
    id: String(p._id),
    name: p.name,
    code: p.code,
    barcode: p.barcode || "",
    category: p.category || "",
    unit: p.unit || "un",
    price: p.price ?? 0,
    cost: p.cost ?? 0,
    stock: p.stock ?? 0,
    tracksStock: Boolean(p.tracksStock),
  }));
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  await connectToDatabase();
  const product = (await Product.findById(id).lean()) as unknown as ProductDocLean | null;
  if (!product) return null;
  return {
    id: String(product._id),
    name: product.name,
    code: product.code,
    barcode: product.barcode || "",
    category: product.category || "",
    unit: product.unit || "un",
    price: product.price ?? 0,
    cost: product.cost ?? 0,
    stock: product.stock ?? 0,
    notes: product.notes || "",
    tracksStock: Boolean(product.tracksStock),
    allowInvoice: Boolean(product.allowInvoice),
    hasVariations: Boolean(product.hasVariations),
    hasComposition: Boolean(product.hasComposition),
  };
}

export async function createProductAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const code = formData.get("code")?.toString().trim();
  const barcode = formData.get("barcode")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const unit = formData.get("unit")?.toString().trim() || "un";
  const notes = formData.get("notes")?.toString().trim() || "";
  const price = Number(formData.get("price"));
  const cost = Number(formData.get("cost")) || 0;
  const stock = Number(formData.get("stock")) || 0;
  const tracksStock = formData.get("tracksStock") === "on";
  const allowInvoice = formData.get("allowInvoice") === "on";
  const hasVariations = formData.get("hasVariations") === "on";
  const hasComposition = formData.get("hasComposition") === "on";

  if (!name) return fail("Informe o nome do produto.", { name: "Obrigatorio" });
  if (!code) return fail("Informe o codigo interno.", { code: "Obrigatorio" });
  if (Number.isNaN(price) || price < 0) {
    return fail("Informe um preco valido.", { price: "Invalido" });
  }
  if (Number.isNaN(stock) || stock < 0) {
    return fail("Informe um estoque inicial valido.", { stock: "Invalido" });
  }

  await connectToDatabase();

  const existing = await Product.findOne({ code });
  if (existing) {
    return fail("Codigo ja cadastrado.", { code: "Duplicado" });
  }

  if (barcode) {
    const existingBarcode = await Product.findOne({ barcode });
    if (existingBarcode) {
      return fail("Codigo de barras ja cadastrado.", { barcode: "Duplicado" });
    }
  }

  await Product.create({
    name,
    code,
    barcode,
    category,
    unit,
    price,
    cost,
    stock,
    notes,
    tracksStock,
    allowInvoice,
    hasVariations,
    hasComposition,
  });

  revalidatePath("/produtos");
  revalidatePath("/caixa");

  return success("Produto cadastrado.");
}

export async function updateProductAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const code = formData.get("code")?.toString().trim();
  const barcode = formData.get("barcode")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const unit = formData.get("unit")?.toString().trim() || "un";
  const notes = formData.get("notes")?.toString().trim() || "";
  const price = Number(formData.get("price"));
  const cost = Number(formData.get("cost")) || 0;
  const stock = Number(formData.get("stock")) || 0;
  const tracksStock = formData.get("tracksStock") === "on";
  const allowInvoice = formData.get("allowInvoice") === "on";
  const hasVariations = formData.get("hasVariations") === "on";
  const hasComposition = formData.get("hasComposition") === "on";

  if (!id) return fail("Produto nao encontrado.");
  if (!name) return fail("Informe o nome do produto.", { name: "Obrigatorio" });
  if (!code) return fail("Informe o codigo interno.", { code: "Obrigatorio" });
  if (Number.isNaN(price) || price < 0) return fail("Informe um preco valido.", { price: "Invalido" });
  if (Number.isNaN(stock) || stock < 0) return fail("Informe um estoque inicial valido.", { stock: "Invalido" });

  await connectToDatabase();

  const conflictCode = await Product.findOne({ code, _id: { $ne: id } });
  if (conflictCode) return fail("Codigo ja cadastrado.", { code: "Duplicado" });

  if (barcode) {
    const conflictBarcode = await Product.findOne({ barcode, _id: { $ne: id } });
    if (conflictBarcode) return fail("Codigo de barras ja cadastrado.", { barcode: "Duplicado" });
  }

  const product = await Product.findById(id);
  if (!product) return fail("Produto nao encontrado.");

  product.name = name;
  product.code = code;
  product.barcode = barcode;
  product.category = category;
  product.unit = unit;
  product.notes = notes;
  product.price = price;
  product.cost = cost;
  product.stock = stock;
  product.tracksStock = tracksStock;
  product.allowInvoice = allowInvoice;
  product.hasVariations = hasVariations;
  product.hasComposition = hasComposition;

  await product.save();

  revalidatePath("/produtos");
  revalidatePath(`/produtos/${id}`);
  revalidatePath("/caixa");

  return success("Produto atualizado.");
}

export async function deleteProductAction(formData: FormData): Promise<ActionState> {
  const id = formData.get("id")?.toString();
  if (!id) return fail("Produto invalido.");

  await connectToDatabase();
  await Product.findByIdAndDelete(id);

  revalidatePath("/produtos");
  revalidatePath("/caixa");

  return success("Produto removido.");
}

export async function finalizeSaleAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const rawItems = formData.get("items")?.toString();
  if (!rawItems) return fail("Nenhum item enviado.");

  let items: SaleItem[];
  try {
    items = JSON.parse(rawItems);
  } catch (err) {
    return fail("Formato de itens invalido.");
  }

  if (!Array.isArray(items) || items.length === 0) return fail("Adicione produtos a venda.");

  await connectToDatabase();

  const saleItems: SaleItem[] = [];

  for (const item of items) {
    if (!item.productId || item.quantity <= 0) {
      return fail("Itens invalidos.");
    }
    const product = await Product.findById(item.productId);
    if (!product) return fail("Produto nao encontrado.");

    if (product.tracksStock && product.stock < item.quantity) {
      return fail(`Estoque insuficiente para ${product.name}.`);
    }

    if (product.tracksStock) {
      product.stock -= item.quantity;
      await product.save();
    }

    saleItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    });
  }

  const valorTotal = saleItems.reduce((sum, current) => sum + current.price * current.quantity, 0);

  try {
    await Sale.create({
      valorTotal,
      itens: saleItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
      })),
    });
  } catch (error) {
    console.error("Erro ao salvar venda", error);
    return fail("Nao foi possivel registrar a venda.");
  }

  revalidatePath("/produtos");
  revalidatePath("/caixa");
  revalidatePath("/dashboard");
  return success("Venda finalizada e estoque atualizado.");
}

export async function redirectToProducts() {
  redirect("/produtos");
}
