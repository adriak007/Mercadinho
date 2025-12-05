import MenuBarComponent from "../components/MenuBarComponent";

export default function ProdutosPage() {
  return (
    <div className="flex">
      <MenuBarComponent />

      <main className="flex-1 bg-gray-100 p-6 min-h-screen">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="mt-4 text-gray-700">
          Listagem, cadastro e edição de produtos aparecerão aqui.
        </p>
      </main>
    </div>
  );
}
