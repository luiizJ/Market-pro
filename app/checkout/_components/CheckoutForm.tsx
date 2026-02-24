"use client";
import { useState } from "react";
import {
  Truck,
  CreditCard,
  Send,
  Loader2,
  User,
  Smartphone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { CheckoutFormData, checkoutSchema } from "@/app/lib/schemas";
import { formatPrice, generateWhatsAppLink } from "@/app/lib/utils";
import { CartItem } from "@/app/types";
import { useStore } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/order";

const CheckoutForm = ({ cart, total }: { cart: CartItem[]; total: number }) => {
  const router = useRouter();
  const clearCart = useStore((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    document: "",
    address: "",
    paymentMethod: "Pix",
  });

  const handleFinishOrder = async () => {
    // 1. Validação Client-Side com Zod
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
      // 2. Dispara a Action (Ela cuida do DB e monta a mensagem)
      const response = await createOrder(
        { ...formData, document: formData.document || "" },
        cart
      );

      if (!response.success || !response.whatsappMessage) {
        throw new Error(
          response.error || "Falha de comunicação com o servidor."
        );
      }

      // 3. UI Action: Abre o WhatsApp com a mensagem formatada que veio do Backend
      window.open(
        generateWhatsAppLink("5583994189808", response.whatsappMessage),
        "_blank"
      );

      // 4. Cleanup
      clearCart();
      router.push("/");
    } catch (err) {
      console.error("Erro no Checkout:", err);
      // Aqui o ideal seria um Toast de erro, mas o console já ajuda
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full space-y-6">
      <Card className="p-8 bg-black border-zinc-900 rounded-3xl space-y-6">
        <h2 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 tracking-[0.2em]">
          <Truck className="w-4 h-4 text-blue-500" /> 01. Informações de Entrega
        </h2>
        <div className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
            <Input
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="pl-12 h-14 bg-zinc-950 border-zinc-900 focus:border-blue-500 text-white rounded-2xl"
              error={errors.name}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
              <Input
                placeholder="WhatsApp"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="pl-12 h-14 bg-zinc-950 border-zinc-900 focus:border-blue-500 text-white rounded-2xl"
                error={errors.phone}
              />
            </div>
            <Input
              placeholder="CPF (Opcional)"
              value={formData.document}
              onChange={(e) =>
                setFormData({ ...formData, document: e.target.value })
              }
              className="h-14 bg-zinc-950 border-zinc-900 focus:border-blue-500 text-white rounded-2xl"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
            <Input
              placeholder="Endereço: Rua, nº e bairro"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="pl-12 h-14 bg-zinc-950 border-zinc-900 focus:border-blue-500 text-white rounded-2xl"
              error={errors.address}
            />
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-black border-zinc-900 rounded-3xl space-y-6">
        <h2 className="text-[10px] font-black uppercase text-zinc-500 flex items-center gap-2 tracking-[0.2em]">
          <CreditCard className="w-4 h-4 text-blue-500" /> 02. Método de
          Pagamento
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {["Pix", "Dinheiro", "Cartão"].map((method) => {
            const active = formData.paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: method as any })
                }
                className={`py-6 text-[10px] font-black uppercase rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  active
                    ? "bg-white text-black border-white scale-105"
                    : "bg-zinc-950 text-zinc-600 border-zinc-900 hover:border-zinc-700"
                }`}
              >
                {active && <CheckCircle2 className="w-4 h-4" />}
                {method}
              </button>
            );
          })}
        </div>
      </Card>

      <Button
        size="lg"
        className="w-full bg-green-600 hover:bg-green-500 text-white h-20 text-lg font-black rounded-3xl active:scale-95 transition-all"
        onClick={handleFinishOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          "FINALIZAR PEDIDO NO WHATSAPP"
        )}
      </Button>
    </div>
  );
};

export default CheckoutForm;
