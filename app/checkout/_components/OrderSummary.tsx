"use client";
import Image from "next/image";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { formatPrice } from "@/app/lib/utils";
import { CartItem } from "@/app/types";

interface OrderSummaryProps {
  cart: CartItem[];
  total: number;
}

const OrderSummary = ({ cart, total }: OrderSummaryProps) => {
  return (
    <aside className="w-full lg:w-[450px] lg:sticky lg:top-28">
      <Card className="p-8 bg-black border-zinc-900 rounded-3xl shadow-none">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">
            Resumo do Pedido
          </h2>
          <Badge
            variant="outline"
            className="border-zinc-800 text-zinc-500 font-bold"
          >
            {cart.length} ITENS
          </Badge>
        </div>

        <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex justify-between items-center group"
            >
              <div className="flex gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-sm leading-tight text-white group-hover:text-blue-500 transition-colors">
                    {item.productName}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-black uppercase mt-0.5">
                    {item.variantName}
                  </p>
                  <p className="text-xs font-black text-blue-500 mt-1">
                    {item.quantity}x {formatPrice(Number(item.price))}
                  </p>
                </div>
              </div>
              <div className="font-black text-sm text-white">
                {formatPrice(Number(item.price) * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-between items-center">
          <span className="font-bold text-zinc-500 uppercase text-[10px] tracking-widest">
            Total a Pagar
          </span>
          <span className="font-black text-3xl tracking-tighter text-white animate-in zoom-in">
            {formatPrice(total)}
          </span>
        </div>
      </Card>
    </aside>
  );
};

export default OrderSummary;
