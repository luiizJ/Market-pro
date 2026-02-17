// src/app/admin/dashboard/products/page.tsx
import { db } from "@/app/db"; // Importe da sua conexão real
import { products, categories, variants } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/app/lib/utils"; // Use seu utilitário
import { ProductActions } from "@/app/components/features/ProductActions";

// Esta é uma Server Component (Busca dados no servidor antes de enviar o HTML)
export default async function AdminProductsPage() {
  // 1. Busca produtos com suas categorias e variantes
  // O Drizzle facilita isso com a API de query
  const productsList = await db.query.products.findMany({
    with: {
      category: true,
      variants: true,
    },
    orderBy: [desc(products.createdAt)], // Mais recentes primeiro
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Produtos</h1>
          <p className="text-slate-500">
            Gerencie seu catálogo ({productsList.length} itens)
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {productsList.map((product) => (
          <Card
            key={product.id}
            className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-slate-300 transition-colors"
          >
            {/* Imagem */}
            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-3xl shrink-0">
              {product.image}
            </div>

            {/* Info Principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-normal">
                  {product.category?.name || "Sem Categoria"}
                </Badge>
                {product.isPromo && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] px-1.5 h-5"
                  >
                    PROMO
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-slate-900 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-slate-500 truncate">
                {product.description}
              </p>
            </div>

            {/* Variantes (Preços) */}
            <div className="flex flex-col items-end gap-1 min-w-[120px]">
              {product.variants.length > 0 ? (
                product.variants.map((v) => (
                  <div key={v.id} className="text-sm flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{v.name}:</span>
                    <span className="font-mono font-medium">
                      {formatPrice(Number(v.price))}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-red-400 italic">
                  Sem variantes
                </span>
              )}
            </div>

            {/* Ações */}
            <ProductActions productId={product.id} />
          </Card>
        ))}

        {productsList.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400">
              Nenhum produto encontrado no banco.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
