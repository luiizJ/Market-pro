// src/app/actions/product.ts
"use server";

import { db } from "@/app/db";
import { orderItems, products, variants } from "@/app/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Tipo esperado do formulário
interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  image: string; // Por enquanto URL, depois podemos por Upload
  isPromo: boolean;
  variants: {
    name: string;
    price: string;
    stock: number;
  }[];
}

export async function createProduct(data: ProductFormData) {
  try {
    // Validação básica
    if (!data.name || !data.categoryId || data.variants.length === 0) {
      return {
        success: false,
        error:
          "Preencha os campos obrigatórios e adicione pelo menos uma variante.",
      };
    }

    // Transação: Salva Produto e Variantes juntos
    await db.transaction(async (tx) => {
      // 1. Cria o Produto
      const [newProduct] = await tx
        .insert(products)
        .values({
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          image: data.image || "📦", // Emoji padrão se não tiver imagem
          isPromo: data.isPromo,
        })
        .returning({ id: products.id });

      // 2. Cria as Variantes vinculadas
      if (data.variants.length > 0) {
        await tx.insert(variants).values(
          data.variants.map((v) => ({
            productId: newProduct.id,
            name: v.name,
            price: v.price.replace(",", "."), // Corrige vírgula se vier
            stock: v.stock,
          }))
        );
      }
    });

    // Atualiza as páginas
    revalidatePath("/admin/dashboard/products");
    revalidatePath("/"); // Atualiza a home da loja também
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return { success: false, error: "Erro ao salvar no banco de dados." };
  }

  // Redireciona fora do try/catch (Padrão do Next.js)
  redirect("/admin/dashboard/products");
}

// Função para deletar (Bônus)
export async function deleteProduct(productId: string) {
  try {
    await db.transaction(async (tx) => {
      // 1. Busca os IDs das variantes desse produto
      const productVariants = await tx
        .select({ id: variants.id })
        .from(variants)
        .where(eq(variants.productId, productId));

      const variantIds = productVariants.map((v) => v.id);

      // 2. DESVINCULA DOS PEDIDOS (Solução do Erro Foreign Key)
      // Se houver variantes, setamos o variantId como NULL na tabela order_items
      // Isso mantém o histórico de vendas (nome, preço), mas permite deletar o produto do catálogo.
      if (variantIds.length > 0) {
        await tx
          .update(orderItems)
          .set({ variantId: null }) // Remove o link
          .where(inArray(orderItems.variantId, variantIds));
      }

      // 3. Agora podemos deletar as variantes tranquilamente
      await tx.delete(variants).where(eq(variants.productId, productId));

      // 4. E finalmente deletar o produto pai
      await tx.delete(products).where(eq(products.id, productId));
    });

    revalidatePath("/admin/dashboard/products");
    revalidatePath("/");
    return { success: true };
  } catch (e: any) {
    console.error("Erro ao deletar:", e);
    return { success: false, error: "Erro ao deletar: " + e.message };
  }
}

export async function updateProduct(productId: string, data: ProductFormData) {
  try {
    await db.transaction(async (tx) => {
      // 1. Atualiza dados básicos do produto
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

      // 2. Atualiza variantes (Estratégia MVP: Deletar todas e recriar)
      // Isso simplifica muito a lógica de "qual variante mudou, qual foi deletada".
      await tx.delete(variants).where(eq(variants.productId, productId));

      if (data.variants.length > 0) {
        await tx.insert(variants).values(
          data.variants.map((v) => ({
            productId: productId,
            name: v.name,
            price: v.price.replace(",", "."),
            stock: v.stock,
          }))
        );
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
