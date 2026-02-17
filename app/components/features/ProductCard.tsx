import { memo } from "react";
import { Product } from "@/app/types";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { formatPrice } from "@/app/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

// "memo" protege o componente de re-renders desnecessários (Performance)
export const ProductCard = memo(({ product, onClick }: ProductCardProps) => {
  // Lógica: Encontrar o menor preço para exibir "A partir de"
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <Card
      /* MUDANÇAS PARA DARK MODE:
         1. bg-card: Fundo escuro
         2. border-border: Borda sutil do tema
      */
      className="overflow-hidden flex flex-col hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] bg-card border-border"
      onClick={() => onClick(product)}
    >
      {/* Imagem / Área Visual */}
      {/* MUDANÇAS:
         1. bg-slate-50 -> bg-muted (Fundo cinza suave no dark, cinza claro no light)
         2. group-hover:bg-muted/80 (Efeito hover)
      */}
      <div className="aspect-square bg-muted flex items-center justify-center text-6xl relative group-hover:bg-muted/80 transition-colors">
        {product.image}
        {product.isPromo && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2 shadow-sm"
          >
            PROMO
          </Badge>
        )}
      </div>

      {/* Detalhes */}
      <div className="p-3 flex flex-col flex-1">
        {/* text-slate-400 -> text-muted-foreground */}
        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider mb-1">
          {product.category}
        </span>

        {/* text-slate-900 -> text-card-foreground */}
        <h3 className="font-semibold text-sm text-card-foreground leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* border-slate-100 -> border-border */}
        <div className="mt-auto pt-2 border-t border-border">
          {/* text-slate-500 -> text-muted-foreground */}
          <p className="text-[10px] text-muted-foreground">A partir de</p>

          {/* text-slate-900 -> text-foreground */}
          <p className="font-bold text-foreground text-lg">
            {formatPrice(minPrice)}
          </p>
        </div>
      </div>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";
