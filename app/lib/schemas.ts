// src/lib/schemas.ts
import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(3, "Por favor, digite seu nome completo"),
  phone: z.string().min(10, "Telefone inválido (mínimo 10 dígitos)"),
  document: z.string().optional(),
  address: z.string().min(5, "Endereço muito curto. Inclua rua e número"),

  // CORREÇÃO: Passamos o array DIRETAMENTE e sem opções de erro complexas.
  // O Zod vai usar a mensagem padrão dele se falhar, o que é suficiente para o MVP.
  paymentMethod: z.enum(["Pix", "Dinheiro", "Cartão"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
