/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import iconGeneral from "../Images/config-general-svgrepo-com.svg";
import iconFolder from "../Images/folder-svgrepo-com.svg";
import iconMoney from "../Images/money-svgrepo-com.svg";
import iconBox from "../Images/box-svgrepo-com.svg";
import iconReport from "../Images/report-svgrepo-com.svg";
import iconTool from "../Images/tool-02-svgrepo-com.svg";
import iconConfig from "../Images/configuration-gear-options-preferences-settings-system-svgrepo-com.svg";
import penIcon from "../Images/pen-svgrepo-com.svg";

const menus = [
  {
    group: "Geral",
    icon: iconGeneral,
    items: [
      { label: "Inicio", link: "/dashboard", icon: iconGeneral },
      { label: "Caixa", link: "/caixa", icon: iconMoney },
    ],
  },
  {
    group: "cadastros",
    icon: iconFolder,
    items: [
      { label: "Produtos", link: "/produtos", icon: iconBox },
      { label: "Relatorios", link: "/relatorios", icon: iconReport },
    ],
  },
  {
    group: "Sistema",
    icon: iconConfig,
    items: [{ label: "Configuracoes", link: "/config", icon: iconTool }],
  },
];

export default function MenuBarComponent() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Geral: false,
    Cadastros: false,
    Sistema: false,
  });

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const result = reader.result as string;
      setLogoPreview(result);
      try {
        await fetch("/api/user/logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logo: result }),
          credentials: "include",
          cache: "no-store",
        });
      } catch (err) {
        // ignora erro de upload
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const res = await fetch("/api/user/me", { credentials: "include", cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.logo) setLogoPreview(data.logo);
      } catch (err) {
        // ignora erro
      }
    };
    loadLogo();
  }, []);

  return (
    <aside className="w-60 bg-slate-100 border-r border-slate-200 p-6 flex flex-col min-h-[calc(100vh-56px)] shadow-[inset_-4px_0_8px_-8px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-center mb-2">
        <div className="relative h-[200px] w-[200px] flex items-center justify-center rounded-sm shadow bg-white border border-slate-200 overflow-hidden">
          {logoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPreview} alt="Logo do negocio" className="h-full w-full object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
              <Image src={iconBox} alt="" className="h-6 w-6" />
              <span>Adicione sua logo</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 left-1 h-6 w-6 rounded-sm bg-black/70 flex items-center justify-center"
            aria-label="Enviar logo"
          >
            <Image src={penIcon} alt="" className="h-3 w-3 invert" />
          </button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />

      <div className="mt-2 -mx-6">
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
                <Image src={menu.icon} alt="" className="h-5 w-5" />
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
                      <Image src={item.icon} alt="" className="h-5 w-5" />
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
