import Link from "next/link";

export default function MenuBarComponent() {
  const menu = [
    { label: "Início", link: "Dashboard" },
    { label: "Caixa", link: "Caixa" },
    { label: "Produtos", link: "Produtos" },
    { label: "Relatórios", link: "Relatorios" },
    { label: "Configurações", link: "Config" },
  ];

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white p-6 flex flex-col shadow-xl">
      <h1 className="text-2xl font-bold mb-8">PDV Supermercado</h1>

      <nav className="flex flex-col gap-3">
        {menu.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-700 text-sm text-gray-400">
        <p>Operador: João</p>
        <Link
          href="/"
          className="mt-3 w-full block py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-center transition"
        >
          Sair
        </Link>
      </div>
    </aside>
  );
}
