import type { CartItem, Order, Product } from "@/app/types";
import { create } from "zustand";

// Definindo o estado global da aplicação
interface AppState {
  cart: CartItem[];
  products: Product[]; // Num app real, viria de uma API (React Query)
  orders: Order[];

  // Actions (Comandos)
  addToCart: (product: Product, variantId: string, qty: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  setProducts: (products: Product[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  cart: [],
  products: [], // Inicialize com seus dados mockados aqui depois
  orders: [],

  // Lógica de Negócio encapsulada aqui
  addToCart: (product, variantId, qty) => {
    // Busca a variante específica baseada no ID
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) return; // Fail fast

    set((state) => {
      const existingItem = state.cart.find(
        (item) => item.variantId === variantId
      );

      // Se já existe, atualiza a quantidade
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: item.quantity + qty }
              : item
          ),
        };
      }

      // Se não existe, cria novo item
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        price: variant.price,
        quantity: qty,
        image: product.image,
      };

      return { cart: [...state.cart, newItem] };
    });
  },

  removeFromCart: (variantId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.variantId !== variantId),
    })),

  clearCart: () => set({ cart: [] }),

  setProducts: (products) => set({ products }),
}));
