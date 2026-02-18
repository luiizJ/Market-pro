"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Menu as MenuIcon,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

const links = [
  { name: "Pedidos", href: "/admin/dashboard", icon: ShoppingBag },
  { name: "Produtos", href: "/admin/dashboard/products", icon: Package },
  { name: "Categorias", href: "/admin/dashboard/categories", icon: MenuIcon },
];

export function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Icon className="w-5 h-5" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
