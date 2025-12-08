/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "./Images/Kero Caixa Sem Fundo.png";
import eyeOn from "./Images/eye-svgrepo-com.svg";
import eyeOff from "./Images/eye-off-svgrepo-com.svg";
import carousel1 from "./Images/Caixa sem fundo1.png";
import carousel2 from "./Images/Caixa sem fundo2.png";

export default function LoginPage() {
  const router = useRouter();
  const baseSlides = [carousel1, carousel2];
  const slides = [baseSlides[baseSlides.length - 1], ...baseSlides, baseSlides[0]];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const emailInvalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const nextSlide = () => {
    setTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  };
  const prevSlide = () => {
    setTransitioning(true);
    setSlideIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (slideIndex === slides.length - 1) {
      setTransitioning(false);
      setSlideIndex(1);
    } else if (slideIndex === 0) {
      setTransitioning(false);
      setSlideIndex(slides.length - 2);
    } else {
      setTransitioning(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao entrar");
        return;
      }
      router.push("/Dashboard");
    } catch (err) {
      setError("Erro de rede ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTransitioning(true);
      setSlideIndex((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-slate-900">
      <section className="relative hidden lg:flex items-center justify-center bg-emerald-700 px-8 overflow-hidden">
        <div className="w-full h-full overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${slideIndex * 100}%)`,
              transition: transitioning ? "transform 0.5s ease-in-out" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((img, idx) => (
              <div
                key={`${img.src}-${idx}`}
                className="w-full flex-shrink-0 flex items-center justify-center"
              >
                <Image src={img} alt="Kero Caixa" className="h-[70vh] w-auto object-contain" priority />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold opacity-80 hover:opacity-100"
          aria-label="Slide anterior"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold opacity-80 hover:opacity-100"
          aria-label="Próximo slide"
        >
          ›
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white text-xl">
          {baseSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTransitioning(true);
                setSlideIndex(idx + 1);
              }}
              className={`h-2 w-2 rounded-full transition ${
                idx === ((slideIndex - 1 + baseSlides.length) % baseSlides.length)
                  ? "bg-white"
                  : "bg-white/50"
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center space-y-4">
            <Image src={logo} alt="Kero Caixa" className="mx-auto h-14 w-auto" priority />
            <p className="text-slate-500 text-sm">Acesse sua conta para continuar</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Digite seu e-mail"
                required
              />
              {emailInvalid && (
                <span className="text-xs text-rose-500">
                  Digite um e-mail valido. Ex: seuemail@gmail.com
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700">
              <span>Senha</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-sm border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 px-2 text-slate-500 hover:text-slate-700 text-sm"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Image src={showPassword ? eyeOn : eyeOff} alt="" className="h-5 w-5" />
                </button>
              </div>
            </label>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="text-sm text-slate-600">
              <Link href="#" className="hover:underline">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Acessar minha conta"}
            </button>
          </form>

          <div className="text-center text-sm text-slate-700 space-y-2">
            <p>
              Ainda nao tem uma conta?{" "}
              <Link href="/Cadastro" className="font-semibold hover:underline">
                Experimente gratis!
              </Link>
            </p>
            <div className="flex items-center justify-center gap-4 text-lg text-slate-500">
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
