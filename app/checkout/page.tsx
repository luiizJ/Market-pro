"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/app/store/useStore";
import { checkoutSchema, CheckoutFormData } from "@/app/lib/schemas";
import { formatPrice, generateWhatsAppLink } from "@/app/lib/utils";
import { createOrder } from "@/app/actions/order";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import {
  ChevronLeft,
  ShoppingCart,
  Truck,
  CreditCard,
  Send,
  Loader2,
} from "lucide-react";

export default function CheckoutPage() {
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

  if (cart.length === 0) {
    return (
      // MUDANÇA: bg-slate-50 -> bg-background
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        {/* MUDANÇA: bg-slate-200 -> bg-muted */}
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          {/* MUDANÇA: text-slate-400 -> text-muted-foreground */}
          <ShoppingCart className="w-8 h-8 text-muted-foreground" />
        </div>
        {/* MUDANÇA: text-slate-900 -> text-foreground */}
        <h2 className="text-xl font-bold text-foreground">
          Seu carrinho está vazio
        </h2>
        <Button onClick={() => router.push("/")}>Voltar às Compras</Button>
      </div>
    );
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
      const response = await createOrder(
        { ...formData, document: formData.document || "" },
        cart
      );

      if (!response.success) {
        throw new Error(response.error || "Erro ao criar pedido");
      }

      const orderId = `#${response.orderId}`;

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

      window.open(generateWhatsAppLink("5583999999999", message), "_blank");

      clearCart();
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao salvar o pedido. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
    // MUDANÇA: bg-slate-50 -> bg-background
    <div className="min-h-screen bg-background pb-20 text-foreground">
      {/* Header Simples */}
      {/* MUDANÇA: bg-white -> bg-card, border-slate-200 -> border-border */}
      <div className="bg-card p-4 border-b border-border sticky top-0 z-20 flex items-center gap-2">
        <Button
          className="text-white"
          variant="default"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-bold text-lg">Finalizar Pedido</h1>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Resumo do Pedido */}
        {/* MUDANÇA: bg-white -> bg-card, border-slate-200 -> border-border */}
        <Card className="p-4 bg-card border-border">
          {/* MUDANÇA: text-slate-500 -> text-muted-foreground */}
          <h2 className="text-sm font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Resumo
          </h2>
          <div className="space-y-4">
            {cart.map((item, idx) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                // MUDANÇA: border-slate-100 -> border-border
                className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0 "
              >
                <div className="flex gap-3">
                  {/* MUDANÇA: bg-slate-100 -> bg-muted */}
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-xl">
                    {item.image}
                  </div>
                  <div>
                    {/* MUDANÇA: text-slate-900 -> text-card-foreground */}
                    <p className="font-bold text-sm text-card-foreground">
                      {item.productName}
                    </p>
                    {/* MUDANÇA: text-slate-500 -> text-muted-foreground */}
                    <p className="text-xs text-muted-foreground">
                      {item.variantName}
                    </p>
                    {/* MUDANÇA: text-blue-600 -> text-primary */}
                    <p className="text-xs font-bold text-primary mt-1">
                      {item.quantity}x {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
                {/* MUDANÇA: text-slate-900 -> text-foreground */}
                <div className="font-bold text-foreground text-sm">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
            {/* MUDANÇA: border-slate-100 -> border-border */}
            <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
              {/* MUDANÇA: text-slate-700 -> text-muted-foreground */}
              <span className="font-bold text-muted-foreground">
                Total a Pagar
              </span>
              {/* MUDANÇA: text-slate-900 -> text-foreground */}
              <span className="font-bold text-xl text-foreground">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Formulário de Entrega */}
        {/* MUDANÇA: bg-white -> bg-card, border-slate-200 -> border-border */}
        <Card className="p-4 bg-card border-border space-y-4  text-white ">
          <h2 className="text-sm font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
            <Truck className="w-4 h-4" /> Dados de Entrega
          </h2>

          <Input
            placeholder="Nome Completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            // MUDANÇA: classes de input já são tratadas no componente Input, mas garantimos bg-muted/50 se necessário
            className="bg-muted/50 border-transparent focus:bg-background focus:border-primary "
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Telefone (WhatsApp)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="bg-muted/50 border-transparent focus:bg-background focus:border-primary"
              error={errors.phone}
            />
            <Input
              placeholder="CPF (Opcional)"
              value={formData.document}
              className="bg-muted/50 border-transparent focus:bg-background focus:border-primary"
              onChange={(e) =>
                setFormData({ ...formData, document: e.target.value })
              }
            />
          </div>

          <Input
            placeholder="Endereço: Rua, Número, Bairro"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="bg-muted/50 border-transparent focus:bg-background focus:border-primary"
            error={errors.address}
          />
        </Card>

        {/* Pagamento */}
        <Card className="p-4 bg-card border-border space-y-3">
          <h2 className="text-sm font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Pagamento
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {["Pix", "Dinheiro", "Cartão"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: method as any })
                }
                /* MUDANÇA: 
                   - bg-slate-900 -> bg-primary
                   - text-white -> text-primary-foreground
                   - bg-white -> bg-card
                   - text-slate-700 -> text-muted-foreground
                   - hover:bg-slate-50 -> hover:bg-muted
                */
                className={`py-2 text-sm font-medium rounded-lg border transition-all 
                  ${
                    formData.paymentMethod === method
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  }`}
              >
                {method}
              </button>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-xs text-destructive">{errors.paymentMethod}</p>
          )}
        </Card>

        {/* Botão Final */}
        <Button
          size="lg"
          // MUDANÇA: Cores específicas (verde) mantidas para destaque de conversão,
          // mas shadow ajustada para não ficar estranha no escuro
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 h-14 text-lg"
          onClick={handleFinishOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Salvando...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" /> Enviar Pedido no Zap
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
