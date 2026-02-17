"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";

// Importações do ShadCN Alert Dialog
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";

interface ProductActionsProps {
  productId: string;
}

export function ProductActions({ productId }: ProductActionsProps) {
  const router = useRouter();

  // useTransition é perfeito para Server Actions pq não bloqueia a UI
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false); // Controla se o modal tá aberto

  const handleDelete = async () => {
    // Inicia a transição (Loading state mais fluido)
    startTransition(async () => {
      const res = await deleteProduct(productId);

      if (!res.success) {
        alert("Erro ao deletar: " + res.error); // Aqui mantemos alert simples para erro, ou poderia ser um Toast
      } else {
        setIsOpen(false); // Fecha o modal no sucesso
      }
    });
  };

  return (
    <div className="flex items-center gap-2 border-l border-slate-100 pl-4 ml-2">
      {/* Botão EDITAR (Sem mudanças) */}
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
        onClick={() =>
          router.push(`/admin/dashboard/products/${productId}/edit`)
        }
      >
        <Pencil className="w-4 h-4" />
      </Button>

      {/* Botão DELETAR com Modal ShadCN */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        {/* O Gatilho (O botão da lixeira) */}
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </AlertDialogTrigger>

        {/* O Conteúdo do Modal */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Tem certeza absoluta?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o
              produto do seu catálogo e removerá o vínculo com pedidos antigos.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Impede o fechamento automático para esperarmos a Promise
                handleDelete();
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Apagando...
                </>
              ) : (
                "Sim, apagar produto"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
