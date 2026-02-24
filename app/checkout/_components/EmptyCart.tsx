"use client";

import { Button } from "@/app/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function EmptyCart() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      {/* Círculo de destaque AMOLED */}
      <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-8 border border-zinc-800 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
        <ShoppingBag className="w-10 h-10 text-zinc-500" />
      </div>

      <h2 className="text-2xl font-black text-white mb-3 tracking-tighter uppercase">
        Carrinho Vazio
      </h2>

      <p className="text-zinc-500 max-w-[280px] text-sm leading-relaxed mb-10">
        Parece que você ainda não selecionou nenhum dos nossos produtos premium.
      </p>

      <Button
        onClick={() => router.push("/")}
        size="lg"
        className="bg-white text-black hover:bg-zinc-200 font-bold px-8 rounded-2xl flex items-center gap-2 transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        VOLTAR ÀS COMPRAS
      </Button>
    </div>
  );
}
