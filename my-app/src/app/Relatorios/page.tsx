import MenuBarComponent from "../components/MenuBarComponent";

export default function RelatoriosPage() {
  return (
    <div className="flex">
      <MenuBarComponent />

      <main className="flex-1 bg-gray-100 p-6 min-h-screen">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="mt-4 text-gray-700">
          Área destinada para relatórios de vendas, caixa e estoque.
        </p>
      </main>
    </div>
  );
}
