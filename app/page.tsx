// src/app/page.tsx
import { db } from "@/app/db";
import { StoreFront } from "@/app/components/features/StoreFront";
import { Product } from "@/app/types";

// Torna a página dinâmica (revalida a cada acesso ou use 'force-dynamic')
// Para e-commerce pequeno, revalidar a cada 0 segundos (sem cache) garante estoque atualizado
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Busca Categorias
  const categoriesData = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  // 2. Busca Produtos (com Variantes e Categoria)
  const productsData = await db.query.products.findMany({
    with: {
      variants: true,
      category: true,
    },
  });

  // 3. Adapter: Transformar dados do Banco (DB) para dados da Interface (UI)
  // O principal aqui é converter o 'decimal' (string) para 'number'
  const formattedProducts: Product[] = productsData.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category?.name || "Geral", // Fallback se categoria for nula
    image: p.image,
    isPromo: p.isPromo || false,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      stock: v.stock,
      price: Number(v.price), // <--- A Mágica da conversão
    })),
  }));

  // 4. Renderiza o Client Component passando os dados prontos
  return (
    <StoreFront products={formattedProducts} categories={categoriesData} />
  );
}
