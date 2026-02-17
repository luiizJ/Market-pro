import { db } from "./index";
import { categories, products, variants } from "./schema";

const main = async () => {
  console.log("🌱 Iniciando Seed...");

  // 1. Limpar o banco (Opcional, mas bom para garantir que não duplique)
  // CUIDADO: Isso apaga tudo! Só use em dev.
  await db.delete(variants);
  await db.delete(products);
  await db.delete(categories);

  console.log("🧹 Banco limpo!");

  // 2. Criar Categorias
  const cats = await db
    .insert(categories)
    .values([
      { name: "Açougue", slug: "acougue", image: "🥩" },
      { name: "Bebidas", slug: "bebidas", image: "🍺" },
      { name: "Laticínios", slug: "laticinios", image: "🧀" },
      { name: "Hortifruti", slug: "hortifruti", image: "🍎" },
      { name: "Mercearia", slug: "mercearia", image: "🥫" },
    ])
    .returning(); // Retorna os IDs gerados

  console.log(`✅ ${cats.length} Categorias criadas.`);

  // Mapa de IDs para fácil acesso
  const catMap = cats.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // 3. Criar Produtos e Variantes
  const productsData = [
    // AÇOUGUE
    {
      name: "Picanha Fatiada",
      description: "Corte nobre, ideal para churrasco.",
      categoryId: catMap["acougue"],
      image: "🥩",
      isPromo: true,
      variants: [
        { name: "Peça Inteira (1.2kg aprox)", price: 89.9, stock: 10 },
        { name: "Fatiada (Bandeja 500g)", price: 45.9, stock: 20 },
      ],
    },
    {
      name: "Linguiça Toscana",
      description: "Linguiça suína temperada.",
      categoryId: catMap["acougue"],
      image: "🌭",
      isPromo: false,
      variants: [
        { name: "Aurora (1kg)", price: 22.5, stock: 50 },
        { name: "Sadia (1kg)", price: 24.9, stock: 40 },
      ],
    },
    // BEBIDAS
    {
      name: "Cerveja Lata",
      description: "Cerveja pilsen gelada.",
      categoryId: catMap["bebidas"],
      image: "🍺",
      isPromo: true,
      variants: [
        { name: "Brahma (350ml)", price: 3.89, stock: 200 },
        { name: "Heineken (350ml)", price: 5.99, stock: 150 },
        { name: "Spaten (350ml)", price: 4.5, stock: 100 },
      ],
    },
    {
      name: "Refrigerante 2L",
      description: "Refrigerante sabor cola.",
      categoryId: catMap["bebidas"],
      image: "🥤",
      isPromo: false,
      variants: [
        { name: "Coca-Cola Original", price: 10.9, stock: 100 },
        { name: "Guaraná Antarctica", price: 8.5, stock: 80 },
      ],
    },
    // LATICÍNIOS
    {
      name: "Margarina",
      description: "Cremosa com sal.",
      categoryId: catMap["laticinios"],
      image: "🧈",
      isPromo: false,
      variants: [
        { name: "Qualy (500g)", price: 9.9, stock: 60 },
        { name: "Deline (500g)", price: 6.5, stock: 40 },
      ],
    },
    // HORTIFRUTI
    {
      name: "Banana Prata",
      description: "Banana madura e doce.",
      categoryId: catMap["hortifruti"],
      image: "🍌",
      isPromo: false,
      variants: [{ name: "Penca (aprox 1kg)", price: 5.99, stock: 30 }],
    },
  ];

  for (const p of productsData) {
    // Insere o produto
    const [insertedProduct] = await db
      .insert(products)
      .values({
        name: p.name,
        description: p.description,
        categoryId: p.categoryId,
        image: p.image,
        isPromo: p.isPromo,
      })
      .returning();

    // Insere as variantes desse produto
    if (p.variants.length > 0) {
      await db.insert(variants).values(
        p.variants.map((v) => ({
          productId: insertedProduct.id,
          name: v.name,
          price: v.price.toString(), // Decimal precisa ser string no insert
          stock: v.stock,
        }))
      );
    }
  }

  console.log(`✅ ${productsData.length} Produtos criados com sucesso!`);
  console.log("🚀 Seed finalizado!");
  process.exit(0);
};

main().catch((err) => {
  console.error("❌ Erro no Seed:", err);
  process.exit(1);
});
