"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoTop from "../Images/Kero Caixa Sem Fundo.png";
import MenuBarComponent from "./MenuBarComponent";

type UserInfo = {
  name: string;
  email: string;
};

export default function Shell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.name && data?.email) {
          setUser({ name: data.name, email: data.email });
        }
      } catch {
        // ignora erro
      }
    };
    loadUser();
  }, []);

  const avatarLetter = user?.name?.[0]?.toUpperCase() || "U";

  const clearAuthCookies = () => {
    const names = ["next-auth.callback-url", "next-auth.csrf-token", "next-auth.session-token"];
    names.forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
    } finally {
      clearAuthCookies();
      setUser(null);
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 shadow">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="h-10 w-10 flex flex-col justify-center gap-1.5 rounded-sm border border-slate-700 bg-slate-800 hover:bg-slate-700 transition"
            aria-label="Alternar menu lateral"
          >
            <span className="mx-auto h-0.5 w-5 bg-white" />
            <span className="mx-auto h-0.5 w-5 bg-white" />
            <span className="mx-auto h-0.5 w-5 bg-white" />
          </button>
          <Image src={logoTop} alt="Kero Caixa" className="h-9 w-auto" />
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-200 relative">
          <span className="hidden sm:inline">Visao geral</span>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="h-9 w-9 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Menu do usuario"
          >
            <div className="h-9 w-9 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-sm font-semibold">
              {avatarLetter}
            </div>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-44 rounded-sm border border-slate-200 bg-white text-slate-800 shadow-lg">
              <div className="px-3 py-2 text-sm border-b border-slate-100">
                <p className="font-semibold">{user?.name || "Usuario"}</p>
                <p className="text-slate-500 text-xs">{user?.email || "nao autenticado"}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && <MenuBarComponent />}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
