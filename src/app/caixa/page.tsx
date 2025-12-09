import Shell from "../components/Shell";
import CaixaForm from "./CaixaForm";
import { finalizeSaleAction, listProducts } from "../actions/products";

export default async function CaixaPage() {
  const products = await listProducts();

  return (
    <Shell>
      <main className="p-8">
        <div className="bg-white shadow-md rounded-sm p-6">
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold uppercase tracking-wide">Localize um produto/servico abaixo</h1>
            <div className="flex items-center gap-2 bg-[#3a8620] text-white rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wide">
              <div className="text-left">
                <p>Cliente: ao consumidor</p>
                <p>Vendedor: cliente</p>
              </div>
              <span className="text-lg">##</span>
            </div>
          </header>

          <CaixaForm products={products} action={finalizeSaleAction} />
        </div>
      </main>
    </Shell>
  );
}
