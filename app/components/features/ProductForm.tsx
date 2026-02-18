"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/product"; // Importe o update!
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";

// Tipos
interface Category {
  id: string;
  name: string;
}
interface Variant {
  name: string;
  price: string;
  stock: number;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    categoryId: string | null;
    image: string;
    isPromo: boolean | null;
    variants: Variant[];
  };
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData; // Booleano: Estamos editando?

  // Estado Inicial Inteligente (Se tiver initialData, usa ele. Se não, usa vazio)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    image: initialData?.image || "",
    isPromo: initialData?.isPromo || false,
  });

  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants.map((v) => ({
      name: v.name,
      price: v.price.toString(), // Garante string para o input
      stock: v.stock,
    })) || [{ name: "", price: "", stock: 0 }]
  );

  // ... (addVariant, removeVariant, updateVariant MANTÉM IGUAL ao anterior) ...
  const addVariant = () =>
    setVariants([...variants, { name: "", price: "", stock: 0 }]);
  const removeVariant = (idx: number) =>
    variants.length > 1 && setVariants(variants.filter((_, i) => i !== idx));
  const updateVariant = (idx: number, field: string, val: any) => {
    const newVars = [...variants];
    newVars[idx] = { ...newVars[idx], [field]: val };
    setVariants(newVars);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      description: formData.description || "",
      variants,
    };

    // Decide se cria ou atualiza
    if (isEditing && initialData) {
      await updateProduct(initialData.id, payload);
    } else {
      await createProduct(payload);
    }
    // Redirect acontece na Server Action
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditing ? "Editar Produto" : "Novo Produto"}
        </h1>
      </div>

      <Card className="p-6 space-y-4">
        {/* Campos básicos (Nome, Descrição...) igual ao anterior */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Imagem (URL/Emoji)</label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="promo"
            className="w-4 h-4"
            checked={formData.isPromo}
            onChange={(e) =>
              setFormData({ ...formData, isPromo: e.target.checked })
            }
          />
          <label htmlFor="promo" className="text-sm font-medium">
            Em Promoção?
          </label>
        </div>
      </Card>

      <Card className="p-6 space-y-4 bg-slate-50">
        <div className="flex justify-between">
          <h3 className="font-bold">Variantes</h3>
          <Button type="button" size="sm" onClick={addVariant}>
            <Plus className="w-4 h-4" /> Adicionar
          </Button>
        </div>
        {variants.map((v, i) => (
          <div
            key={i}
            className="flex gap-2 items-end bg-white p-2 rounded border"
          >
            <Input
              placeholder="Nome"
              value={v.name}
              onChange={(e) => updateVariant(i, "name", e.target.value)}
            />
            <Input
              placeholder="Preço"
              type="number"
              step="0.01"
              className="w-24"
              value={v.price}
              onChange={(e) => updateVariant(i, "price", e.target.value)}
            />
            <Input
              placeholder="Qtd"
              type="number"
              className="w-20"
              value={v.stock}
              onChange={(e) =>
                updateVariant(i, "stock", Number(e.target.value))
              }
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => removeVariant(i)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save className="mr-2" />
          )}
          {isEditing ? "Salvar Alterações" : "Criar Produto"}
        </Button>
      </div>
    </form>
  );
}
