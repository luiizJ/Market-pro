import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função helper do ShadCN para mergear classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatador de Moeda (Intl API é mais performática que libs pesadas)
export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Gerador de Link do WhatsApp
export const generateWhatsAppLink = (phone: string, text: string) => {
  // Remove tudo que não for número (Regex simples)
  const cleanPhone = phone.replace(/\D/g, "");
  return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`;
};
