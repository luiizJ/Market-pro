"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { checkoutSchema, CheckoutFormData } from "@/app/lib/schemas";
import { formatPrice, generateWhatsAppLink } from "@/app/lib/utils";
import { createOrder } from "@/app/actions/order";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  ChevronLeft,
  Truck,
  CreditCard,
  Send,
  Loader2,
  User,
  MapPin,
  Smartphone,
  CheckCircle2,
  PackageSearch,
} from "lucide-react";

const Header = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cart, clearCart } = useStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    document: "",
    address: "",
    paymentMethod: "Pix",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});

  // Proteção contra carrinho vazio
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <PackageSearch className="w-10 h-10 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">
          O carrinho está vazio
        </h2>
        <Button onClick={() => router.push("/")} className="font-bold mt-4">
          Voltar para a Loja
        </Button>
      </div>
    );
  }

  // Lógica de cálculo de total (preservada)
  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  // Lógica Finalizar Pedido (Preservada e Adaptada)
  const handleFinishOrder = async () => {
    const result = checkoutSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: any = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Persistência no Banco (Mandatório)
      const response = await createOrder(
        { ...formData, document: formData.document || "" },
        cart
      );

      if (!response.success) {
        throw new Error(response.error || "Falha na criação do pedido");
      }

      const orderId = `#${response.orderId}`;

      // 2. Geração da Mensagem WhatsApp
      const message =
        `*NOVO PEDIDO ${orderId}*\n\n` +
        `👤 *Cliente:* ${formData.name}\n` +
        `📞 *Tel:* ${formData.phone}\n` +
        `📍 *Endereço:* ${formData.address}\n` +
        `💳 *Pagamento:* ${formData.paymentMethod}\n\n` +
        `*RESUMO DO PEDIDO:*\n` +
        cart
          .map((i) => `▪ ${i.quantity}x ${i.productName} (${i.variantName})`)
          .join("\n") +
        `\n\n💰 *TOTAL: ${formatPrice(total)}*`;

      window.open(generateWhatsAppLink("55839994189808", message), "_blank");

      clearCart();
      router.push("/");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <header className="bg-black/90 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full text-zinc-500 hover:text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-black text-xl tracking-[0.2em] uppercase">
          Checkout
        </h1>
      </div>
    </header>
  );
};
export default Header;
