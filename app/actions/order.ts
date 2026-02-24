"use server";

import { z } from "zod";
import { db } from "@/app/db";
import { orders, orderItems, variants } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/app/lib/utils";
import { checkoutSchema } from "@/app/lib/schemas"; // O schema do cliente

// 1. Zod Schemas de Proteção
const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  productName: z.string(),
  variantName: z.string(),
  price: z.union([z.number(), z.string()]), // Protege contra injeção de tipos
  quantity: z.number().int().min(1, "Quantidade deve ser maior que zero"),
  image: z.string().optional(),
});

const cartSchema = z
  .array(cartItemSchema)
  .min(1, "O carrinho não pode estar vazio");

// Schema para proteger a rota do Admin
const statusSchema = z.enum(["Pendente", "Entregue", "Cancelado"]);

/**
 * 🚀 CRIA UM NOVO PEDIDO
 * (Usado tanto pelo Checkout do Cliente quanto pelo PDV do Admin)
 */
export async function createOrder(data: unknown, cart: unknown) {
  try {
    // A PORTA DE AÇO: Zod no Backend
    const parsedData = checkoutSchema.safeParse(data);
    const parsedCart = cartSchema.safeParse(cart);

    if (!parsedData.success || !parsedCart.success) {
      console.error("🚨 Payload bloqueado pelo Zod.");
      return { success: false, error: "Dados inválidos fornecidos." };
    }

    const validData = parsedData.data;
    const validCart = parsedCart.data;

    // Cálculo do total 100% no servidor
    const total = validCart.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );

    let newOrderId;

    // Transação Atômica Drizzle (Cria Pedido + Itens + Baixa Estoque)
    await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(orders)
        .values({
          customerName: validData.name,
          customerPhone: validData.phone,
          customerAddress: validData.address,
          paymentMethod: validData.paymentMethod,
          total: total.toString(),
          status: "Pendente",
        })
        .returning();

      newOrderId = newOrder.id;

      await tx.insert(orderItems).values(
        validCart.map((item) => ({
          orderId: newOrder.id,
          variantId: item.variantId,
          productName: item.productName,
          variantName: item.variantName,
          price: item.price.toString(),
          quantity: item.quantity,
        }))
      );

      // ATUALIZA O ESTOQUE 📉
      for (const item of validCart) {
        await tx
          .update(variants)
          .set({ stock: sql`${variants.stock} - ${item.quantity}` })
          .where(eq(variants.id, item.variantId));
      }
    });

    // Monta a mensagem do Zap (O Checkout usa, o Admin pode ignorar ou usar)
    const orderRef = `#${newOrderId}`;
    const message =
      `*NOVO PEDIDO ${orderRef}*\n\n` +
      `👤 *Cliente:* ${validData.name}\n` +
      `📞 *Tel:* ${validData.phone}\n` +
      `📍 *Endereço:* ${validData.address}\n` +
      `💳 *Pagamento:* ${validData.paymentMethod}\n\n` +
      `*🛒 RESUMO DO PEDIDO:*\n` +
      validCart
        .map((i) => `▪ ${i.quantity}x ${i.productName} (${i.variantName})`)
        .join("\n") +
      `\n\n💰 *TOTAL A PAGAR: ${formatPrice(total)}*`;

    // Atualiza todo o sistema para refletir o novo estoque e pedido
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/products");
    revalidatePath("/");

    return {
      success: true,
      orderId: newOrderId,
      whatsappMessage: message,
    };
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error);
    if (error.code === "23514") {
      return {
        success: false,
        error: "Estoque insuficiente para este pedido.",
      };
    }
    return { success: false, error: "Ocorreu um erro interno no servidor." };
  }
}

/**
 * 🛡️ ATUALIZA O STATUS DO PEDIDO (Ação Exclusiva do Admin)
 */
export async function updateOrderStatus(
  orderId: number,
  newStatusInput: unknown
) {
  try {
    // Zod garantindo que o Admin não mande um status quebrado pro banco
    const parsedStatus = statusSchema.parse(newStatusInput);

    await db
      .update(orders)
      .set({ status: parsedStatus })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false, error: "Status inválido ou erro no servidor." };
  }
}
