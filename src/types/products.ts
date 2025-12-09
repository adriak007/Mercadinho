export type SaleItem = { productId: string; quantity: number; price: number };

export type ProductListItem = {
  id: string;
  name: string;
  code: string;
  barcode?: string;
  category?: string;
  unit?: string;
  price: number;
  cost?: number;
  stock: number;
  tracksStock: boolean;
};

export type ProductDetail = ProductListItem & {
  notes: string;
  allowInvoice: boolean;
  hasVariations: boolean;
  hasComposition: boolean;
};
