"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  CreditCard,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/app/lib/utils";

// Tipagem do Pedido (Baseada no seu Schema)
interface OrderItem {
  productName: string;
  variantName: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  total: string;
  status: string | null;
  paymentMethod: string;
  createdAt: Date | null;
  items: OrderItem[];
}

interface OrderDetailModalProps {
  order: Order;
  children: React.ReactNode; // O botão/card que vai abrir o modal
}

export function OrderDetailModal({ order, children }: OrderDetailModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* O children é o gatilho (pode ser o Card do pedido inteiro ou um botão "Ver Detalhes") */}
        <div className="cursor-pointer hover:bg-slate-50 transition-colors rounded-lg">
          {children}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white text-slate-900 ">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              #{order.id}
            </Badge>
            <span className="text-xs text-slate-500">
              {new Date(order.createdAt!).toLocaleString("pt-BR")}
            </span>
          </div>
          <DialogTitle className="text-xl">Detalhes do Pedido</DialogTitle>
          <DialogDescription>
            Confira os itens e dados de entrega abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Total */}
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex flex-col gap-2 ">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Status
              </span>
              <Badge
                variant={
                  order.status === "Entregue"
                    ? "default"
                    : order.status === "Cancelado"
                    ? "destructive"
                    : "secondary"
                }
                className={
                  order.status === "Entregue"
                    ? "bg-green-600 hover:bg-green-700"
                    : order.status === "Pendente"
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : ""
                }
              >
                {order.status}
              </Badge>
            </div>
            <div className="text-right space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Total
              </span>
              <div className="text-xl font-bold text-slate-900">
                {formatPrice(Number(order.total))}
              </div>
            </div>
          </div>

          {/* Lista de Itens */}
          <div className="">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3 text-slate-900">
              <ShoppingBag className="w-4 h-4 text-blue-600" /> Itens do Pedido
            </h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 space-y-4">
                    <div className="font-bold text-slate-400 w-6 text-center">
                      {item.quantity}x
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {item.productName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.variantName}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium text-slate-700">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="grid grid-cols-2 gap-4 ">
            <div className="space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <User className="w-4 h-4 text-blue-600" /> Cliente
              </h3>
              <div className="text-sm text-slate-600 space-y-3">
                <p className="font-medium text-slate-900">
                  {order.customerName}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {order.customerPhone}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <MapPin className="w-4 h-4 text-blue-600" /> Entrega
              </h3>
              <p className="text-sm text-slate-600 leading-tight">
                {order.customerAddress}
              </p>
            </div>
          </div>

          {/* Pagamento */}
          <div className="pt-2 border-t border-slate-100 ">
            <p className="text-sm flex mt-6 items-center gap-2 text-slate-600">
              <CreditCard className="w-4 h-4 text-slate-400" />
              Pagamento via{" "}
              <span className="font-bold text-slate-900">
                {order.paymentMethod}
              </span>
            </p>
          </div>
        </div>

        {/* Footer (Ações Rápidas) */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Fechar
          </Button>
          {/* Aqui poderíamos colocar um botão "Imprimir Pedido" no futuro */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
