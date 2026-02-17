"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/actions/product";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export function CreateProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estado do Produto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: categories[0]?.id || "", // Pega a primeira categoria por padrão
    image: "", // Emoji ou URL
    isPromo: false,
  });

  // Estado das Variantes (Array Dinâmico)
  const [variants, setVariants] = useState([
    { name: "", price: "", stock: 0 }, // Começa com uma vazia
  ]);

  // Handlers de Variante
  const addVariant = () => {
    setVariants([...variants, { name: "", price: "", stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) return; // Não deixa apagar a última
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Envio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createProduct({
      ...formData,
      variants,
    });

    if (result && !result.success) {
      alert(result.error);
      setLoading(false);
    }
    // Se der sucesso, a action faz o redirect, não precisa tratar aqui
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Dados Principais */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
          Informações Básicas
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Produto</label>
          <Input
            required
            placeholder="Ex: Coca-Cola 2L"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <Input
            placeholder="Ex: Gelada e refrescante"
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
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
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
            <label className="text-sm font-medium">
              Emoji ou URL da Imagem
            </label>
            <Input
              placeholder="Ex: 🥤 ou https://..."
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
            id="isPromo"
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={formData.isPromo}
            onChange={(e) =>
              setFormData({ ...formData, isPromo: e.target.checked })
            }
          />
          <label
            htmlFor="isPromo"
            className="text-sm font-medium cursor-pointer select-none"
          >
            Este produto está em Promoção? 🔥
          </label>
        </div>
      </Card>

      {/* Variantes */}
      <Card className="p-6 space-y-4 bg-slate-50 border-slate-200">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h3 className="font-bold text-slate-900">Variações e Preços</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addVariant}
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar Opção
          </Button>
        </div>

        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="flex gap-3 items-end bg-white p-3 rounded-lg border border-slate-200 shadow-sm animate-in slide-in-from-left-2"
            >
              <div className="flex-1 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Nome/Tamanho
                </label>
                <Input
                  required
                  placeholder="Ex: Lata 350ml"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, "name", e.target.value)}
                />
              </div>
              <div className="w-24 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Preço (R$)
                </label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="w-20 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Estoque
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              {variants.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-red-500 mb-0.5"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Footer Fixo */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
        </Button>
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Produto
        </Button>
      </div>
    </form>
  );
}
