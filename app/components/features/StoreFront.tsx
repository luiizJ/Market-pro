"use client";

import { useState } from "react";
import { Product } from "@/app/types";
import { ProductCard } from "@/app/components/features/ProductCard";
import { ProductModal } from "@/app/components/features/ProductModal";
import { CartSummary } from "@/app/components/features/CartSummary";
import { Flame, Search } from "lucide-react";
import { Input } from "@/app/components/ui/input";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
}

interface StoreFrontProps {
  products: Product[];
  categories: CategoryData[];
}

export function StoreFront({ products, categories }: StoreFrontProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Todos" ||
      (activeCategory === "Ofertas"
        ? product.isPromo
        : product.category === activeCategory);

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pb-32 bg-background text-foreground">
      {/* Header Fixo */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b border-border bg-background/80">
        {/* MUDANÇA 1: De max-w-md para max-w-7xl (Muito mais largo) */}
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
          <div className="flex items-center gap-2">
            {/* ... Logo ... */}
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              B2B
            </div>
            <div>
              <h1 className="font-bold text-foreground leading-none">
                MarketPro
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium">
                Abastecimento Inteligente
              </p>
            </div>
          </div>

          {/* Barra de Busca */}
          <div className="relative">
            {/* ... Input ... */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categorias Dinâmicas */}
        {/* MUDANÇA 2: Também aumentamos para max-w-7xl para alinhar com o conteúdo */}
        <div className="px-4 pb-3 overflow-x-auto flex gap-2 no-scrollbar max-w-7xl mx-auto">
          {/* ... Botões de Categoria (mantém igual) ... */}
          <button
            onClick={() => setActiveCategory("Todos")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border
               ${
                 activeCategory === "Todos"
                   ? "bg-primary text-primary-foreground border-primary"
                   : "bg-card border-border text-muted-foreground hover:text-foreground"
               }`}
          >
            Todos
          </button>

          <button
            onClick={() => setActiveCategory("Ofertas")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 border
               ${
                 activeCategory === "Ofertas"
                   ? "bg-destructive text-destructive-foreground border-destructive"
                   : "bg-card border-border text-muted-foreground hover:text-foreground"
               }`}
          >
            <Flame className="w-3 h-3" /> Ofertas
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border
                 ${
                   activeCategory === cat.name
                     ? "bg-primary text-primary-foreground border-primary"
                     : "bg-card border-border text-muted-foreground hover:text-foreground"
                 }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Grid de Produtos */}
      {/* MUDANÇA 3: Aumentamos o container e mudamos o grid para ser responsivo */}
      <div className="max-w-7xl mx-auto p-4 py-6">
        {filteredProducts.length > 0 ? (
          /* GRID RESPONSIVO:
             - grid-cols-2 (Celular)
             - md:grid-cols-3 (Tablet)
             - lg:grid-cols-4 (Notebook)
             - xl:grid-cols-5 (Monitor Grande)
          */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>Nenhum produto encontrado.</p>
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartSummary />
    </main>
  );
}
