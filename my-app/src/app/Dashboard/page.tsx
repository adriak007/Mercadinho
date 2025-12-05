import MenuBarComponent from "../components/MenuBarComponent";

export default function DashboardPage() {
  return (
    <div className="flex">
      <MenuBarComponent />

      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="mt-6">
          <p>Bem-vindo ao sistema de caixa! (Esqueleto)</p>
        </div>
      </main>
    </div>
  );
}
