// src/app/admin/dashboard/products/new/page.tsx
import { db } from "@/app/db";
import { CreateProductForm } from "@/app/components/features/CreateProductForm";

export default async function NewProductPage() {
  // Precisamos das categorias para o dropdown
  const categories = await db.query.categories.findMany();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Novo Produto</h1>
        <p className="text-slate-500">Adicione itens ao seu catálogo</p>
      </div>

      {/* Passamos as categorias para o formulário Client-Side */}
      <CreateProductForm categories={categories} />
    </div>
  );
}
