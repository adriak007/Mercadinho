import MenuBarComponent from "../layout";
export default function CaixaPage() {
  return (
    <div className="flex">
      <MenuBarComponent />

      <main className="flex-1 bg-gray-100 p-6 min-h-screen">
        <h1 className="text-2xl font-bold">Caixa</h1>
        <p className="mt-4 text-gray-700">
          Tela do caixa do operador (PDV). Aqui futuramente ficará o registro de
          vendas.
        </p>
      </main>
    </div>
  );
}
