import { memo } from "react";
import Image from "next/image"; // 👈 Importação essencial
import { Product } from "@/app/types";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { formatPrice } from "@/app/lib/utils";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard = memo(({ product, onClick }: ProductCardProps) => {
  // Garantimos que o preço seja tratado como número para o Math.min
  const minPrice = Math.min(...product.variants.map((v) => Number(v.price)));

  return (
    <Card
      className="overflow-hidden flex flex-col hover:shadow-xl transition-all cursor-pointer group active:scale-[0.98] bg-card border-border h-full"
      onClick={() => onClick(product)}
    >
      {/* Área da Imagem */}
      <div className="aspect-square bg-muted relative overflow-hidden">
        {/* Substituímos o {product.image} por Next.js Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />

        {/* Overlay gradiente para dar profundidade (Opcional, mas fica pro) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {product.isPromo && (
          <Badge
            variant="destructive"
            className="absolute top-2 left-2 shadow-lg font-bold"
          >
            PROMO
          </Badge>
        )}
      </div>

      {/* Detalhes */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] uppercase text-muted-foreground font-black tracking-widest mb-1">
          {product.category}
        </span>

        <h3 className="font-bold text-base text-card-foreground leading-snug mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-3 border-t border-border/50 flex justify-between items-end">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase">
              A partir de
            </p>
            <p className="font-black text-foreground text-xl tracking-tight">
              {formatPrice(minPrice)}
            </p>
          </div>

          {/* Badge de "Ver mais" que aparece no hover */}
          <div className="bg-blue-600 p-1.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );
});

ProductCard.displayName = "ProductCard";
