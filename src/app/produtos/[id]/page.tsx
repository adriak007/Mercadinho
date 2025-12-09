import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "../../components/Shell";
import ProductForm from "../ProductForm";
import { getProductById, updateProductAction } from "../../actions/products";

type Props = {
  params: { id: string };
};

export default async function EditarProdutoPage({ params }: Props) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <Shell>
      <main className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">Editar produto</h1>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span>Inicio</span>
            <span>/</span>
            <Link href="/produtos" className="text-[#3a8620] hover:underline">
              Produtos
            </Link>
            <span>/</span>
            <span>{product?.name}</span>
          </div>
        </div>

        <ProductForm action={updateProductAction} initialData={product} mode="edit" />
      </main>
    </Shell>
  );
}
