/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../Images/Kero Caixa Sem Fundo.png";
import eyeOn from "../Images/eye-svgrepo-com.svg";
import eyeOff from "../Images/eye-off-svgrepo-com.svg";
import carousel1 from "../Images/Caixa sem fundo1.png";
import carousel2 from "../Images/Caixa sem fundo2.png";

type FormField = "company" | "name" | "phone" | "whatsapp" | "email" | "password";

function FieldErrorBadge({ message }: { message: string }) {
  return (
    <div className="pointer-events-none absolute left-0 top-full mt-1 inline-flex items-center gap-2 rounded-md border border-[#3a8620]/30 bg-[#e6f5dd] px-3 py-1 text-xs text-[#245713] shadow-sm">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#3a8620]/10 text-[10px] font-semibold text-[#245713]">
        !
      </span>
      <span>{message}</span>
    </div>
  );
}

export default function CadastroPage() {
  const router = useRouter();
  const baseSlides = [carousel1, carousel2];
  const slides = [baseSlides[baseSlides.length - 1], ...baseSlides, baseSlides[0]];
  const [form, setForm] = useState({
    company: "",
    name: "",
    phone: "",
    whatsapp: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const clearFieldError = (field: FormField) =>
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  const updateField = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    clearFieldError(field);
    handleChange(field)(e);
  };
  const emailInvalid = form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const showFieldError = (field: FormField, message: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
    setTimeout(() => {
      setFieldErrors((prev) => {
        if (prev[field] !== message) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }, 2000);
  };

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

  useEffect(() => {
    const id = setInterval(() => {
      setTransitioning(true);
      setSlideIndex((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!form.company.trim()) {
      showFieldError("company", "Preencha este campo");
      hasError = true;
    }
    if (!form.name.trim()) {
      showFieldError("name", "Preencha este campo");
      hasError = true;
    }
    if (!form.phone.trim()) {
      showFieldError("phone", "Preencha este campo");
      hasError = true;
    }
    if (!form.email.trim()) {
      showFieldError("email", "Preencha este campo");
      hasError = true;
    } else if (emailInvalid) {
      showFieldError("email", "Digite um e-mail valido.");
      hasError = true;
    }
    if (!form.password.trim()) {
      showFieldError("password", "Preencha este campo");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar");
        return;
      }
      router.push("/");
    } catch (err) {
      setError("Erro de rede ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-slate-900">
      <section className="relative hidden lg:flex items-center justify-center bg-[#3a8620] px-8 overflow-hidden">
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
        <div className="w-full max-w-3xl space-y-6">
          <div className="text-center space-y-4">
            <Image
              src={logo}
              alt="Kero Caixa"
              className="mx-auto h-[200px] w-[200px] object-contain"
              priority
            />
            <p className="text-slate-500 text-sm">Crie sua conta em poucos passos</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <TextField
              name="company"
              label="Nome da empresa"
              required
              value={form.company}
              onChange={updateField("company")}
              error={fieldErrors.company}
            />
            <TextField
              name="name"
              label="Nome completo"
              required
              value={form.name}
              onChange={updateField("name")}
              error={fieldErrors.name}
            />
            <div className="grid md:grid-cols-2 gap-3">
              <TextField
                name="phone"
                label="Telefone"
                required
                value={form.phone}
                onChange={updateField("phone")}
                error={fieldErrors.phone}
              />
              <TextField
                name="whatsapp"
                label="Whatsapp (Opcional)"
                value={form.whatsapp}
                onChange={updateField("whatsapp")}
                error={fieldErrors.whatsapp}
              />
            </div>
            <TextField
              name="email"
              label="E-mail"
              required
              type="email"
              value={form.email}
              onChange={updateField("email")}
              error={fieldErrors.email}
            />
            <TextField
              name="password"
              label="Senha"
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={updateField("password")}
              error={fieldErrors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="px-2 text-slate-500 hover:text-slate-700 text-sm"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Image src={showPassword ? eyeOn : eyeOff} alt="" className="h-5 w-5" />
                </button>
              }
            />

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-[#3a8620] text-white py-3 font-semibold hover:bg-[#326f1b] transition disabled:opacity-60"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 space-y-2">
            <p>
              Ja tem uma conta?{" "}
              <Link href="/" className="font-semibold hover:underline">
                Acessar o sistema
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

function TextField({
  label,
  type = "text",
  required,
  name,
  value,
  onChange,
  error,
  rightSlot,
}: {
  label: string;
  type?: string;
  required?: boolean;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <label className="relative flex flex-col gap-2 text-sm text-slate-700">
      <span>
        {label}
        {required ? "*" : ""}
      </span>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          className="w-full rounded-sm border border-slate-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3a8620]"
          placeholder={`Digite ${label.toLowerCase()}`}
          required={required}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>
      <div className="min-h-[24px]">
        {error && <FieldErrorBadge message={error} />}
      </div>
    </label>
  );
}
