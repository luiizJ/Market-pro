// src/app/admin/dashboard/products/[id]/edit/page.tsx
import { db } from "@/app/db";
import { products } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { ProductForm } from "@/app/components/features/ProductForm";
import { redirect } from "next/navigation";

// CORREÇÃO: O tipo de params agora é uma Promise
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // CORREÇÃO: Desembrulhamos o params com await antes de usar
  const { id } = await params;

  // 1. Busca o produto pelo ID (usando a variável 'id' desembrulhada)
  const productData = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      variants: true,
    },
  });

  // 2. Busca categorias para o select
  const categories = await db.query.categories.findMany();

  // Fail Safe: Se não achar o produto (URL errada), volta pra lista
  if (!productData) {
    redirect("/admin/dashboard/products");
  }

  // 3. Adapter
  const formattedData = {
    ...productData,
    variants: productData.variants.map((v) => ({
      name: v.name,
      price: v.price.toString(),
      stock: v.stock,
    })),
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProductForm categories={categories} initialData={formattedData} />
    </div>
  );
}
