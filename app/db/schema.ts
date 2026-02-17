import {
  pgTable,
  serial,
  text,
  decimal,
  boolean,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Tabela de Categorias (Ex: Laticínios, Açougue)
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Tabela de Produtos
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id), // Chave Estrangeira
  image: text("image").notNull(),
  isPromo: boolean("is_promo").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. Tabela de Variantes (Onde fica o preço e estoque real)
// Ex: Produto "Coca Cola", Variante "Lata 350ml" - R$ 5,00
export const variants = pgTable("variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(), // Ex: "500g", "1kg", "Lata"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Use decimal para dinheiro!
  stock: integer("stock").default(0).notNull(),
});

// 4. Tabela de Pedidos
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(), // ID numérico simples (#10234) fica melhor para pedidos visuais
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("Pendente"), // Pendente, Entregue, Cancelado
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. Itens do Pedido (Tabela Pivot)
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  variantId: uuid("variant_id").references(() => variants.id), // Pode ser nulo se o produto for deletado, mas mantemos o histórico
  productName: text("product_name").notNull(), // Snapshot do nome na hora da compra
  variantName: text("variant_name").notNull(), // Snapshot da variante
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Preço na hora da compra
  quantity: integer("quantity").notNull(),
});

// --- RELACIONAMENTOS (Para facilitar queries depois) ---

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(variants),
}));

export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
