// src/app/admin/dashboard/products/page.tsx
import { db } from "@/app/db";
import { products, categories, variants } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Plus, PackageX } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { ProductActions } from "@/app/components/features/ProductActions";
import Image from "next/image";

// Server Component (Roda no servidor, seguro para queries)
export default async function AdminProductsPage() {
  const productsList = await db.query.products.findMany({
    with: {
      category: true,
      variants: true,
    },
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div className="space-y-6">
      {/* HEADER DO PAINEL */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Produtos
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie seu catálogo • {productsList.length}{" "}
            {productsList.length === 1 ? "item" : "itens"}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      {/* LISTA DE PRODUTOS */}
      <div className="grid grid-cols-1 gap-4">
        {productsList.map((product) => (
          <Card
            key={product.id}
            className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-white border-slate-200 hover:border-blue-300 hover:shadow-md transition-all rounded-xl group"
          >
            {/* 📸 ÁREA DA IMAGEM CORRIGIDA */}
            <div className="relative w-20 h-20 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="80px"
              />
            </div>

            {/* Info Principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge
                  variant="secondary"
                  className="text-[10px] font-medium text-slate-600 bg-slate-100 uppercase tracking-wide"
                >
                  {product.category?.name || "Sem Categoria"}
                </Badge>
                {product.isPromo && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] font-bold px-1.5 h-5 uppercase tracking-wide"
                  >
                    PROMO
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 text-base truncate">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 truncate mt-0.5">
                {product.description}
              </p>
            </div>

            {/* Variantes (Preços) */}
            <div className="flex flex-col sm:items-end gap-1 min-w-[140px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {product.variants.length > 0 ? (
                product.variants.map((v) => (
                  <div
                    key={v.id}
                    className="text-sm flex items-center justify-between sm:justify-end gap-3 w-full"
                  >
                    <span className="text-slate-500 text-xs font-medium">
                      {v.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(Number(v.price))}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">
                  Sem Estoque / Variantes
                </span>
              )}
            </div>

            {/* Ações */}
            <div className="pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto flex justify-end">
              <ProductActions productId={product.id} />
            </div>
          </Card>
        ))}

        {/* EMPTY STATE LIGHT */}
        {productsList.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
              <PackageX className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium text-sm">
              Nenhum produto cadastrado no catálogo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
