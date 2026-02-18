// src/app/actions/product.ts
"use server";

import { db } from "@/app/db";
import { orderItems, products, variants } from "@/app/db/schema";
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. INTERFACE AJUSTADA (O 'id' é opcional para suportar novas variantes)
interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  image: string;
  isPromo: boolean;
  variants: {
    id?: string; // 👈 ESSENCIAL: O '?' permite que variantes novas não tenham ID
    name: string;
    price: string;
    stock: number;
  }[];
}

export async function createProduct(data: ProductFormData) {
  try {
    if (!data.name || !data.categoryId || data.variants.length === 0) {
      return { success: false, error: "Preencha os campos obrigatórios." };
    }

    await db.transaction(async (tx) => {
      const [newProduct] = await tx
        .insert(products)
        .values({
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          image: data.image || "📦",
          isPromo: data.isPromo,
        })
        .returning({ id: products.id });

      await tx.insert(variants).values(
        data.variants.map((v) => ({
          productId: newProduct.id,
          name: v.name,
          price: v.price.replace(",", "."),
          stock: v.stock,
        }))
      );
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return { success: false, error: "Erro ao salvar no banco." };
  }
  redirect("/admin/dashboard/products");
}

export async function updateProduct(productId: string, data: ProductFormData) {
  try {
    await db.transaction(async (tx) => {
      // 1. Atualiza dados básicos
      await tx
        .update(products)
        .set({
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          image: data.image,
          isPromo: data.isPromo,
        })
        .where(eq(products.id, productId));

      // 2. BUSCAR VARIANTES ATUAIS NO BANCO
      const dbVariants = await tx
        .select({ id: variants.id })
        .from(variants)
        .where(eq(variants.productId, productId));

      const dbVariantIds = dbVariants.map((v) => v.id);

      // IDs que vieram no formulário e que já existem
      const incomingVariantIds = data.variants
        .map((v) => v.id)
        .filter((id): id is string => !!id);

      // 3. IDENTIFICAR O QUE DELETAR (Está no DB mas não veio no Form)
      const idsToDelete = dbVariantIds.filter(
        (id) => !incomingVariantIds.includes(id)
      );

      if (idsToDelete.length > 0) {
        // Soft Unlink nos pedidos para não quebrar a Foreign Key
        await tx
          .update(orderItems)
          .set({ variantId: null })
          .where(inArray(orderItems.variantId, idsToDelete));

        // Deleta as variantes que saíram da lista
        await tx.delete(variants).where(inArray(variants.id, idsToDelete));
      }

      // 4. UPSERT (Update ou Insert) NAS VARIANTES QUE FICARAM/ENTRARAM
      for (const v of data.variants) {
        const payload = {
          productId: productId,
          name: v.name,
          price: v.price.replace(",", "."),
          stock: v.stock,
        };

        if (v.id) {
          // Já existe? Dá Update
          await tx.update(variants).set(payload).where(eq(variants.id, v.id));
        } else {
          // Não tem ID? É nova, dá Insert
          await tx.insert(variants).values(payload);
        }
      }
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false, error: "Erro ao atualizar produto." };
  }
  redirect("/admin/dashboard/products");
}

export async function deleteProduct(productId: string) {
  try {
    await db.transaction(async (tx) => {
      const productVariants = await tx
        .select({ id: variants.id })
        .from(variants)
        .where(eq(variants.productId, productId));

      const variantIds = productVariants.map((v) => v.id);

      if (variantIds.length > 0) {
        await tx
          .update(orderItems)
          .set({ variantId: null })
          .where(inArray(orderItems.variantId, variantIds));
      }

      await tx.delete(variants).where(eq(variants.productId, productId));
      await tx.delete(products).where(eq(products.id, productId));
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    console.error("Erro ao deletar:", e);
    return { success: false, error: "Erro ao deletar produto." };
  }
}
