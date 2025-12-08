export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Página não encontrada
      </h2>
      <p className="text-gray-600 max-w-md mb-6">
        A página que você está procurando pode ter sido removida, ter mudado de
        endereço ou não existir.
      </p>
      <link
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-sm shadow hover:bg-blue-700 transition"
      >
        Voltar para a Home
      </link>
    </div>
  );
}
