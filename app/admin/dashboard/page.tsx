// src/app/admin/dashboard/page.tsx
import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { DollarSign, ShoppingBag, Clock } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { OrderActions } from "@/app/components/features/OrderActions.tsx";
import { OrderDetailModal } from "@/app/components/features/OrderDetailModal";

// Página Principal do Painel (Visão Geral de Pedidos)
export default async function DashboardHome() {
  // 1. Busca os últimos pedidos no Banco de Dados
  const allOrders = await db.query.orders.findMany({
    orderBy: [desc(orders.createdAt)],
    limit: 20, // Traz apenas os 20 últimos para não pesar
    with: {
      items: true, // Traz os itens junto (Eager Loading)
    },
  });

  // 2. Cálculos Rápidos (KPIs)
  const totalRevenue = allOrders.reduce(
    (acc, order) => acc + Number(order.total),
    0
  );
  const pendingOrders = allOrders.filter((o) => o.status === "Pendente").length;
  const deliveredOrders = allOrders.filter(
    (o) => o.status === "Entregue"
  ).length;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500">
          Acompanhe o desempenho da sua loja hoje.
        </p>
      </div>

      {/* Cards de Métricas (KPIs) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue)}
            </div>
            <p className="text-xs text-slate-500">
              Baseado nos últimos 20 pedidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-slate-500">Precisam de atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregues</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
            <p className="text-xs text-slate-500">Pedidos concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pedidos Recentes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Últimos Pedidos</h2>

        {allOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900">Nenhum pedido ainda</h3>
            <p className="text-sm text-slate-500">
              Quando os clientes comprarem, aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allOrders.map((order) => (
              <OrderDetailModal key={order.id} order={order}>
                <Card
                  key={order.id}
                  className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-transparent hover:border-l-blue-500 transition-all"
                >
                  {/* Info do Cliente */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        #{order.id}
                      </span>
                      <span className="font-bold text-slate-900">
                        {order.customerName}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <span>{order.items.length} itens</span>
                      <span>•</span>
                      <span>
                        {new Date(order.createdAt!).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {/* Status e Ações */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right mr-4">
                      <div className="font-bold text-slate-900">
                        {formatPrice(Number(order.total))}
                      </div>
                      <div className="text-xs text-slate-500">
                        {order.paymentMethod}
                      </div>
                    </div>

                    <Badge
                      variant={
                        order.status === "Entregue"
                          ? "default"
                          : order.status === "Cancelado"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        order.status === "Entregue"
                          ? "bg-green-600 hover:bg-green-700"
                          : order.status === "Pendente"
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : ""
                      }
                    >
                      {order.status}
                    </Badge>

                    {/* 👇 AQUI ESTÁ A MÁGICA: Substituímos os botões estáticos pelo componente interativo */}
                    <OrderActions
                      orderId={order.id}
                      currentStatus={order.status || "Pendente"}
                    />
                  </div>
                </Card>
              </OrderDetailModal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
