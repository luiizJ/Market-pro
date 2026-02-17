"use client";

import { useStore } from "@/app/store/useStore";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export function CartSummary() {
  const router = useRouter();

  // Seletores do Zustand (Best Practice: selecionar apenas o que usa)
  const cart = useStore((state) => state.cart);

  if (cart.length === 0) return null;

  // Lógica de cálculo (Derived State)
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-500">
      <Button
        className="w-full h-16 rounded-2xl shadow-xl shadow-slate-900/20 flex justify-between items-center px-6 text-lg bg-slate-900 hover:bg-slate-800 transition-transform active:scale-[0.98]"
        onClick={() => router.push("/checkout")} // Vamos criar essa rota depois
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm relative">
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900">
              {itemCount}
            </span>
          </div>
          <div className="flex flex-col items-start leading-none gap-1">
            <span className="text-sm font-medium text-slate-300">
              Ver Carrinho
            </span>
            <span className="font-bold text-white">
              {formatPrice(totalValue)}
            </span>
          </div>
        </div>

        <span className="text-sm font-semibold text-slate-300">
          Ir para Pagamento →
        </span>
      </Button>
    </div>
  );
}
