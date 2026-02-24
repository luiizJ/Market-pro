"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // 👈 Importante
import { X, Minus, Plus, CheckCircle2 } from "lucide-react";
import { Product, Variant } from "@/app/types";
import { useStore } from "@/app/store/useStore";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { formatPrice } from "@/app/lib/utils";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    if (product) {
      setSelectedVariant(null);
      setQty(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant.id, qty);
      onClose();
    }
  };

  const handleIncrement = () => {
    if (selectedVariant && qty < selectedVariant.stock) {
      setQty(qty + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="w-full sm:max-w-xl bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
        {/* Banner de Imagem / Header */}
        <div className="relative h-48 sm:h-56 bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent" />

          <Button
            variant="default"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border-none"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 pt-2">
          {/* Info do Produto */}
          <div className="mb-6">
            <Badge
              variant="outline"
              className="mb-2 border-primary/50 text-primary"
            >
              {product.category}
            </Badge>
            <h2 className="text-2xl font-black text-card-foreground tracking-tight">
              {product.name}
            </h2>
          </div>

          {/* Seleção de Variante */}
          <div className="space-y-3 mb-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Selecione a Opção:
            </p>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQty(1);
                    }}
                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all shadow-sm
                      ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                      }`}
                  >
                    <div>
                      <span
                        className={`block font-bold text-sm ${
                          isSelected ? "text-primary" : "text-card-foreground"
                        }`}
                      >
                        {variant.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        Disponível: {variant.stock} un
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-card-foreground">
                        {formatPrice(Number(variant.price))}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer: Quantidade e Ação */}
          <div className="flex gap-3 pt-6 border-t border-border">
            <div className="flex items-center border border-border rounded-xl h-14 bg-muted/30 p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-full flex items-center justify-center hover:bg-card rounded-lg text-foreground transition-all disabled:opacity-30"
                disabled={!selectedVariant || qty <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-10 text-center font-black text-foreground text-lg">
                {qty}
              </span>

              <button
                onClick={handleIncrement}
                className="w-10 h-full flex items-center justify-center hover:bg-card rounded-lg text-foreground transition-all disabled:opacity-30"
                disabled={
                  !selectedVariant || qty >= (selectedVariant.stock || 0)
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              className="flex-1 h-14 text-lg font-bold  "
              disabled={!selectedVariant}
              onClick={handleAddToCart}
            >
              {selectedVariant
                ? `Adicionar • ${formatPrice(
                    Number(selectedVariant.price) * qty
                  )}`
                : "Escolha uma opção"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
