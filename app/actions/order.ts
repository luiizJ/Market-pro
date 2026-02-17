"use server";

import { db } from "@/app/db";
import { orders, orderItems, variants } from "@/app/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CartItem } from "@/app/types";

// Tipo dos dados do cliente (reaproveitando do Zod se quiser, ou definindo aqui)
interface CustomerData {
  name: string;
  phone: string;
  document?: string;
  address: string;
  paymentMethod: string;
}

/**
 * CRIA UM NOVO PEDIDO (Transação Atômica)
 */
export async function createOrder(customer: CustomerData, cart: CartItem[]) {
  try {
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const result = await db.transaction(async (tx) => {
      // 1. Cria o Pedido
      const [newOrder] = await tx
        .insert(orders)
        .values({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          paymentMethod: customer.paymentMethod,
          total: total.toString(),
          status: "Pendente",
        })
        .returning({ id: orders.id });

      // 2. Processa os itens do carrinho
      if (cart.length > 0) {
        // Insere na tabela de itens do pedido
        await tx.insert(orderItems).values(
          cart.map((item) => ({
            orderId: newOrder.id,
            productName: item.productName,
            variantName: item.variantName,
            price: item.price.toString(),
            quantity: item.quantity,
            variantId: item.variantId,
          }))
        );

        // 3. ATUALIZA O ESTOQUE (Novo Passo) 📉
        for (const item of cart) {
          await tx
            .update(variants)
            .set({
              // SQL Puro: stock = stock - quantity
              stock: sql`${variants.stock} - ${item.quantity}`,
            })
            .where(eq(variants.id, item.variantId));
        }
      }

      return newOrder;
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/products"); // Atualiza a lista de produtos no admin
    revalidatePath("/"); // Atualiza a loja (pra ninguém comprar produto esgotado)

    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error);

    // Tratamento de erro caso o estoque fique negativo (constraint check violation)
    if (error.code === "23514") {
      return {
        success: false,
        error: "Estoque insuficiente para um dos itens.",
      };
    }

    return { success: false, error: "Falha ao processar pedido" };
  }
}

/**
 * ATUALIZA O STATUS DO PEDIDO (Admin)
 */
export async function updateOrderStatus(
  orderId: number,
  newStatus: "Pendente" | "Entregue" | "Cancelado"
) {
  try {
    await db
      .update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, orderId));

    // Atualiza a tela do painel instantaneamente
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar status" };
  }
}
