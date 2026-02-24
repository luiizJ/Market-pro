"use client";
import { useStore } from "@/app/store/useStore";
import OrderSummary from "./_components/OrderSummary";
import CheckoutForm from "./_components/CheckoutForm";
import Header from "./_components/Header";
import { EmptyCart } from "./_components/EmptyCart";

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-black pb-32">
      <Header />
      <main className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8 items-start mt-6">
        <OrderSummary cart={cart} total={total} />
        <CheckoutForm cart={cart} total={total} />
      </main>
    </div>
  );
}
