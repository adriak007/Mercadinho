import Link from "next/link";
import Shell from "../../components/Shell";
import ProductForm from "../ProductForm";
import { createProductAction } from "../../actions/products";

export default function AdicionarProdutoPage() {
  return (
    <Shell>
      <main className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">Adicionar produto</h1>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span>Inicio</span>
            <span>/</span>
            <Link href="/produtos" className="text-[#3a8620] hover:underline">
              Produtos
            </Link>
            <span>/</span>
            <span>Adicionar</span>
          </div>
        </div>

        <ProductForm action={createProductAction} mode="create" />
      </main>
    </Shell>
  );
}
