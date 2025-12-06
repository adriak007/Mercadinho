import MenuBarComponent from "../layout";
export default function ConfigPage() {
  return (
    <div className="flex">
      <MenuBarComponent />

      <main className="flex-1 bg-gray-100 p-6 min-h-screen">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="mt-4 text-gray-700">
          Configurações do sistema e do operador ficarão aqui.
        </p>
      </main>
    </div>
  );
}
