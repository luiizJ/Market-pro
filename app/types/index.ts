// Princípio: Interface Segregation (SOLID) - Criamos tipos específicos ao invés de um tipo gigante.

export interface Variant {
  id: string;
  //productId: string;
  name: string; // ex: "Deline - 500g"
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  isPromo: boolean;
  variants: Variant[];
}

// DTO (Data Transfer Object) para o Carrinho
// Não precisamos do objeto Product inteiro no carrinho, apenas o necessário.
export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: "Pendente" | "Entregue" | "Cancelado";
  date: string;
}
