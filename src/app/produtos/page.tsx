import Link from "next/link";
import Shell from "../components/Shell";
import { deleteProductAction, listProducts } from "../actions/products";

async function deleteProductFormAction(formData: FormData) {
  "use server";
  await deleteProductAction(formData);
}

export default async function ProdutosPage() {
  const products = await listProducts();

  return (
    <Shell>
      <main className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm border border-slate-200 bg-slate-50 flex items-center justify-center text-lg font-semibold text-slate-700">
              PR
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">Produtos</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Inicio</span>
            <span>/</span>
            <span>Produtos</span>
            <span>/</span>
            <span>Listar</span>
          </div>
        </div>

        <div className="rounded-sm border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 p-4">
            <Link
              href="/produtos/adicionar"
              className="inline-flex items-center gap-2 rounded-sm bg-[#3a8620] px-4 py-2 text-white text-sm font-semibold hover:bg-[#326f1b] transition"
            >
              + Adicionar
            </Link>
            <button className="inline-flex items-center gap-2 rounded-sm bg-slate-900 px-4 py-2 text-white text-sm font-semibold hover:bg-slate-800 transition">
              Mais acoes
            </button>
            <button className="inline-flex items-center gap-2 rounded-sm border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Lista
            </button>
            <div className="ml-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar"
                className="rounded-sm border border-slate-200 px-4 py-2 text-sm text-slate-800 w-64 focus:outline-none focus:ring-2 focus:ring-[#3a8620]"
              />
              <button className="rounded-sm border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                ĐY"?
              </button>
              <button className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition">
                Busca avancada
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-800">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Codigo</th>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Estoque</th>
                  <th className="px-4 py-3 font-semibold text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                )}
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">{product.code}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/produtos/${product.id}`}
                        className="rounded-sm bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                      >
                        Editar
                      </Link>
                      <form action={deleteProductFormAction} className="inline">
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          className="rounded-sm bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600 transition"
                        >
                          Excluir
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </Shell>
  );
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
