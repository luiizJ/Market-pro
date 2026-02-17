"use client";

import { useState, useEffect } from "react";
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* MUDANÇAS VISUAIS:
         1. bg-white -> bg-card (Fundo escuro)
         2. text-slate-900 -> text-card-foreground (Texto claro)
         3. border border-border (Borda sutil)
      */}
      <div className="w-full sm:max-w-xl bg-card border border-border rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            {/* bg-slate-100 -> bg-muted */}
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-3xl shadow-inner">
              {product.image}
            </div>
            <div>
              <h2 className="text-xl font-bold text-card-foreground leading-tight">
                {product.name}
              </h2>
              <Badge variant="secondary" className="mt-1">
                {product.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Seleção de Variante */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
            Selecione a Opção:
          </p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              return (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQty(1);
                  }}
                  /* LOGICA DE CORES DA VARIANTE:
                     - Selecionado: Borda Primary, Fundo Primary/10 (transparente), Texto Primary
                     - Normal: Borda Border, Hover Muted
                  */
                  className={`w-full p-3 rounded-xl border text-left flex justify-between items-center transition-all 
                    ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                >
                  <div>
                    <span
                      className={`block font-medium text-sm ${
                        isSelected ? "text-primary" : "text-card-foreground"
                      }`}
                    >
                      {variant.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Estoque: {variant.stock} un
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-card-foreground">
                      {formatPrice(variant.price)}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: Quantidade e Ação */}
        <div className="flex gap-4 pt-4 border-t border-border">
          <div className="flex items-center border border-border rounded-lg h-12 bg-background/50">
            {/* Botão Menos */}
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 h-full hover:bg-muted rounded-l-lg text-foreground disabled:opacity-50 transition-colors"
              disabled={!selectedVariant || qty <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-10 text-center font-bold text-foreground text-sm">
              {qty}
            </span>

            {/* Botão Mais */}
            <button
              onClick={handleIncrement}
              className="px-3 h-full hover:bg-muted rounded-r-lg text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={!selectedVariant || qty >= selectedVariant.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button
            className="flex-1 h-12 text-base shadow-lg shadow-black/20"
            disabled={!selectedVariant}
            onClick={handleAddToCart}
          >
            {selectedVariant
              ? `Adicionar • ${formatPrice(selectedVariant.price * qty)}`
              : "Selecione uma opção"}
          </Button>
        </div>
      </div>
    </div>
  );
}
