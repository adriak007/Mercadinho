import Link from "next/link";

export default function LoginPDV() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 w-full max-w-sm p-8 rounded-sm shadow-2xl text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login do Operador
        </h1>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Usuário</label>
            <input
              type="text"
              className="w-full p-3 rounded-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              className="w-full p-3 rounded-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Digite sua senha"
            />
          </div>

          <button className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-sm font-semibold transition">
            <Link href="/Dashboard" className="block w-full h-full text-center">
              Entrar
            </Link>
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Sistema PDV • Supermercado
        </p>
      </div>
    </div>
  );
}
