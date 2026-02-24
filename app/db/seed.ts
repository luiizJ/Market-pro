import { db } from "./index";
import { categories, products, variants, orders, orderItems } from "./schema";

const main = async () => {
  console.log("🚀 Iniciando SEED DE ELITE Industrial para o MarketPro...");

  // 1. Limpeza total (Evitando conflitos de FK)
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(variants);
  await db.delete(products);
  await db.delete(categories);

  console.log("🧹 Banco resetado. Construindo catálogo real...");

  // 2. Categorias com Imagens Reais
  const cats = await db
    .insert(categories)
    .values([
      {
        name: "Bebidas",
        slug: "bebidas",
        image:
          "https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Açougue",
        slug: "acougue",
        image:
          "https://images.unsplash.com/photo-1607623273573-599d008636b6?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Mercearia",
        slug: "mercearia",
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Hortifruti",
        slug: "hortifruti",
        image:
          "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Limpeza",
        slug: "limpeza",
        image:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Laticínios",
        slug: "laticinios",
        image:
          "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Padaria",
        slug: "padaria",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
      },
      {
        name: "Higiene",
        slug: "higiene",
        image:
          "https://images.unsplash.com/photo-1559594864-bf2422790933?q=80&w=800&auto=format&fit=crop",
      },
    ])
    .returning();

  const catMap = cats.reduce((acc, cat) => {
    acc[cat.slug] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  // 3. Catálogo Massivo (40 Produtos com Imagens Reais)
  const productsData = [
    // BEBIDAS
    {
      name: "Refrigerante Coca-Cola",
      category: "bebidas",
      isPromo: true,
      img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop",
      variants: [
        { name: "Lata 350ml", price: "4.50", stock: 120 },
        { name: "Pet 2L", price: "11.90", stock: 200 },
      ],
    },
    {
      name: "Cerveja Heineken",
      category: "bebidas",
      img: "https://images.unsplash.com/photo-1618885472179-5e474019f2a9?q=80&w=800&auto=format&fit=crop",
      variants: [
        { name: "Long Neck 330ml", price: "7.90", stock: 150 },
        { name: "Lata 350ml", price: "5.80", stock: 300 },
      ],
    },
    {
      name: "Água Mineral",
      category: "bebidas",
      img: "https://images.unsplash.com/photo-1638688569176-5b6db19f9d2a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Sem Gás 500ml", price: "2.50", stock: 500 }],
    },
    {
      name: "Vinho Tinto Reserva",
      category: "bebidas",
      img: "https://plus.unsplash.com/premium_photo-1668442073028-2b8200b9ea1f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Garrafa 750ml", price: "45.00", stock: 30 }],
    },
    {
      name: "Energético Red Bull",
      category: "bebidas",
      img: "https://images.unsplash.com/photo-1613208602577-50fd21015cca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Lata 250ml", price: "8.90", stock: 100 }],
    },

    // AÇOUGUE
    {
      name: "Picanha Premium",
      category: "acougue",
      isPromo: true,
      img: "https://images.unsplash.com/photo-1702288824213-58b8b47732b0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Peça kg", price: "95.90", stock: 15 }],
    },
    {
      name: "Alcatra",
      category: "acougue",
      img: "https://plus.unsplash.com/premium_photo-1668616814977-05202080759c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Bife kg", price: "48.90", stock: 30 }],
    },
    {
      name: "Filé de Frango",
      category: "acougue",
      img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Bandeja 1kg", price: "22.90", stock: 50 }],
    },
    {
      name: "Linguiça Toscana",
      category: "acougue",
      img: "https://images.unsplash.com/photo-1591989330748-777649e84466?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Pacote 1kg", price: "24.50", stock: 100 }],
    },
    {
      name: "Costela Bovina",
      category: "acougue",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Ripa kg", price: "28.90", stock: 20 }],
    },

    // MERCEARIA
    {
      name: "Arroz Extra Fino",
      category: "mercearia",
      img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Pacote 5kg", price: "29.90", stock: 150 }],
    },
    {
      name: "Feijão Macassar",
      category: "mercearia",
      img: "https://plus.unsplash.com/premium_photo-1671130295735-25af5e78d40c?q=80&w=684&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Pacote 1kg", price: "8.50", stock: 200 }],
    },
    {
      name: "Azeite de Oliva",
      category: "mercearia",
      isPromo: true,
      img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Galo 500ml", price: "45.00", stock: 40 }],
    },
    {
      name: "Café Gourmet",
      category: "mercearia",
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Vácuo 500g", price: "18.90", stock: 100 }],
    },
    {
      name: "Macarrão Italiano",
      category: "mercearia",
      img: "https://images.unsplash.com/photo-1718043934012-380f4e72a1cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Grano Duro 500g", price: "9.50", stock: 60 }],
    },

    // HORTIFRUTI
    {
      name: "Banana Prata",
      category: "hortifruti",
      img: "https://images.unsplash.com/photo-1523667864248-fc55f5bad7e2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Penca kg", price: "6.50", stock: 40 }],
    },
    {
      name: "Maçã Gala",
      category: "hortifruti",
      img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Saco 1kg", price: "10.90", stock: 30 }],
    },
    {
      name: "Batata Lavada",
      category: "hortifruti",
      img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Saco 2kg", price: "12.00", stock: 100 }],
    },
    {
      name: "Tomate Italiano",
      category: "hortifruti",
      img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "kg", price: "8.90", stock: 50 }],
    },
    {
      name: "Abacaxi Pérola",
      category: "hortifruti",
      img: "https://plus.unsplash.com/premium_photo-1724255994628-dceb76a829e8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Unidade", price: "7.50", stock: 40 }],
    },

    // LIMPEZA
    {
      name: "Detergente Líquido",
      category: "limpeza",
      img: "https://plus.unsplash.com/premium_photo-1681284938563-852a6e4a45e7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Neutro 500ml", price: "2.60", stock: 300 }],
    },
    {
      name: "Sabão em Pó Omo",
      category: "limpeza",
      isPromo: true,
      img: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "1.6kg", price: "26.90", stock: 80 }],
    },
    {
      name: "Amaciante ",
      category: "limpeza",
      img: "https://images.unsplash.com/photo-1624372635310-01d078c05dd9?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Concentrado 1L", price: "18.00", stock: 60 }],
    },
    {
      name: "Desinfetante Pinho",
      category: "limpeza",
      img: "https://images.unsplash.com/photo-1624372635310-01d078c05dd9?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Tradicional 1L", price: "14.90", stock: 100 }],
    },
    {
      name: "Papel Higiênico",
      category: "limpeza",
      img: "https://images.unsplash.com/photo-1584556812945-a6830379555b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Fio Duplo 12 rolos", price: "22.90", stock: 50 }],
    },

    // LATICÍNIOS
    {
      name: "Leite Integral",
      category: "laticinios",
      img: "https://images.unsplash.com/photo-1634141510639-d691d86f47be?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Caixa 1L", price: "5.80", stock: 240 }],
    },
    {
      name: "Queijo Muçarela",
      category: "laticinios",
      img: "https://images.unsplash.com/photo-1683314573422-649a3c6ad784?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Peça kg", price: "45.00", stock: 20 }],
    },
    {
      name: "Manteiga Extra",
      category: "laticinios",
      img: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Com Sal 200g", price: "14.90", stock: 30 }],
    },
    {
      name: "Iogurte",
      category: "laticinios",
      img: "https://plus.unsplash.com/premium_photo-1726765806715-607476022597?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Copinho 170g", price: "3.50", stock: 80 }],
    },
    {
      name: "Requeijão Cremoso",
      category: "laticinios",
      img: "https://images.unsplash.com/photo-1592981749207-bdbb9b981cb5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Copo 200g", price: "9.90", stock: 80 }],
    },

    // PADARIA
    {
      name: "Pão de Forma",
      category: "padaria",
      img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Pacote 500g", price: "9.50", stock: 40 }],
    },
    {
      name: "Pão Francês",
      category: "padaria",
      img: "https://images.unsplash.com/photo-1580745605349-4f50567c1729?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Unidade", price: "0.70", stock: 500 }],
    },
    {
      name: "Croissant de Frango",
      category: "padaria",
      img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Unidade", price: "8.50", stock: 15 }],
    },
    {
      name: "Bolo de chocolate",
      category: "padaria",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Pedaço", price: "5.00", stock: 20 }],
    },
    {
      name: "Biscoito Recheado",
      category: "padaria",
      img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Pacote 140g", price: "3.50", stock: 120 }],
    },

    // HIGIENE
    {
      name: "Shampoo Anticaspa",
      category: "higiene",
      img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Frasco 400ml", price: "24.90", stock: 40 }],
    },
    {
      name: "Sabonete Dove",
      category: "higiene",
      img: "https://images.unsplash.com/photo-1589060040782-234fa4ee0b61?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Barra 90g", price: "4.50", stock: 200 }],
    },
    {
      name: "Creme Dental",
      category: "higiene",
      img: "https://images.unsplash.com/photo-1610216690558-4aee861f4ab3?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Tubo 90g", price: "12.90", stock: 100 }],
    },
    {
      name: "Desodorante Roll-on",
      category: "higiene",
      img: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?q=80&w=800&auto=format&fit=crop",
      variants: [{ name: "Frasco 50ml", price: "16.90", stock: 120 }],
    },
    {
      name: "Fio Dental",
      category: "higiene",
      img: "https://images.unsplash.com/photo-1559818469-fdf7a1ae929c?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      variants: [{ name: "Unidade 50m", price: "10.50", stock: 60 }],
    },
  ];

  const allVariants: any[] = [];

  for (const p of productsData) {
    const [insertedProduct] = await db
      .insert(products)
      .values({
        name: p.name,
        categoryId: catMap[p.category],
        image: p.img,
        isPromo: p.isPromo || false,
      })
      .returning();

    const insertedVariants = await db
      .insert(variants)
      .values(
        p.variants.map((v) => ({
          productId: insertedProduct.id,
          name: v.name,
          price: v.price,
          stock: v.stock,
        }))
      )
      .returning();

    allVariants.push(
      ...insertedVariants.map((v) => ({ ...v, productName: p.name }))
    );
  }

  console.log(`✅ ${productsData.length} Produtos industriais criados.`);

  // 4. Simulando Pedidos para Dashboard
  console.log("📈 Gerando histórico de vendas...");
  const ordersSeeds = [
    {
      name: "Luiz Janampa",
      phone: "83999998888",
      addr: "Rua do Porto, Cabedelo",
      status: "Entregue",
    },
    {
      name: "Maria Silva",
      phone: "83988887777",
      addr: "Intermares, Cabedelo",
      status: "Pendente",
    },
  ];

  for (const o of ordersSeeds) {
    const v1 = allVariants[Math.floor(Math.random() * allVariants.length)];
    const v2 = allVariants[Math.floor(Math.random() * allVariants.length)];
    const total = (parseFloat(v1.price) + parseFloat(v2.price)).toFixed(2);

    const [newOrder] = await db
      .insert(orders)
      .values({
        customerName: o.name,
        customerPhone: o.phone,
        customerAddress: o.addr,
        total: total,
        status: o.status,
        paymentMethod: "Pix",
      })
      .returning();

    await db.insert(orderItems).values([
      {
        orderId: newOrder.id,
        variantId: v1.id,
        productName: v1.productName,
        variantName: v1.name,
        price: v1.price,
        quantity: 1,
      },
      {
        orderId: newOrder.id,
        variantId: v2.id,
        productName: v2.productName,
        variantName: v2.name,
        price: v2.price,
        quantity: 1,
      },
    ]);
  }

  console.log("🏁 SEED FINALIZADA. O banco está pronto para a apresentação!");
  process.exit(0);
};

main().catch((err) => {
  console.error("❌ Erro no Seed:", err);
  process.exit(1);
});
