/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import logoSide from "../Images/Kero Caixa Logo Full.png";

const menus = [
  {
    group: "Geral",
    icon: "🧭",
    items: [
      { label: "Inicio", link: "/Dashboard", icon: "🏠" },
      { label: "Caixa", link: "/Caixa", icon: "💵" },
    ],
  },
  {
    group: "Cadastros",
    icon: "📂",
    items: [
      { label: "Produtos", link: "/Produtos", icon: "📦" },
      { label: "Relatorios", link: "/Relatorios", icon: "📊" },
    ],
  },
  {
    group: "Sistema",
    icon: "⚙️",
    items: [{ label: "Configuracoes", link: "/Config", icon: "🛠️" }],
  },
];

export default function MenuBarComponent() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Geral: false,
    Cadastros: false,
    Sistema: false,
  });

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-60 bg-slate-100 border-r border-slate-200 p-6 flex flex-col min-h-[calc(100vh-56px)] shadow-[inset_-4px_0_8px_-8px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex items-center justify-center rounded-sm shadow bg-white">
          <Image src={logoSide} alt="Kero Caixa" className="h-10 w-auto" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Loja
          </p>
          <p className="text-lg font-semibold text-slate-800">Kero Caixa</p>
        </div>
      </div>

      <div className="mt-6 -mx-6">
        {menus.map((menu, idx) => (
          <div
            key={menu.group}
            className={`${idx > 0 ? "border-t border-slate-200" : ""} overflow-hidden`}
          >
            <button
              onClick={() => toggleGroup(menu.group)}
              className="w-full flex items-center justify-between bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-700 uppercase tracking-wide hover:text-slate-800 transition"
            >
              <span className="flex items-center gap-3">
                <span aria-hidden className="text-base">{menu.icon}</span>
                {menu.group}
              </span>
              <span
                className={`transition-transform duration-200 ${
                  openGroups[menu.group] ? "rotate-90" : ""
                }`}
              >
                &gt;
              </span>
            </button>
            <div className="overflow-hidden transition-all duration-400 ease-out bg-white">
              <nav
                className="flex flex-col gap-0 pl-3 transition-all duration-400 ease-out"
                style={{
                  maxHeight: openGroups[menu.group] ? `${menu.items.length * 48}px` : "0px",
                  opacity: openGroups[menu.group] ? 1 : 0,
                  transform: openGroups[menu.group] ? "translateY(0)" : "translateY(-6px)",
                }}
              >
                {menu.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.link}
                    className="px-6 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50 transition flex items-center"
                  >
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="text-base">{item.icon}</span>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
