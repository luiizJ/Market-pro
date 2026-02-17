"use client";

import { updateOrderStatus } from "@/app/actions/order";
import { Button } from "@/app/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface OrderActionsProps {
  orderId: number;
  currentStatus: string;
}

export function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (
    newStatus: "Pendente" | "Entregue" | "Cancelado"
  ) => {
    setLoading(true);
    await updateOrderStatus(orderId, newStatus);
    setLoading(false);
  };

  if (currentStatus === "Entregue" || currentStatus === "Cancelado") {
    return null; // Não mostra ações se já finalizou
  }

  return (
    <div className="flex gap-1">
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 text-green-600 hover:bg-green-50 border-green-200"
        title="Marcar Entregue"
        disabled={loading}
        onClick={() => handleUpdate("Entregue")}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
      </Button>

      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 text-red-600 hover:bg-red-50 border-red-200"
        title="Cancelar Pedido"
        disabled={loading}
        onClick={() => handleUpdate("Cancelado")}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
