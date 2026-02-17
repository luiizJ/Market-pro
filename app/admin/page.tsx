"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";
import { setAdminCookie } from "../actions/auth";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    // Chama a Server Action para validar e setar o cookie HTTPOnly
    const result = await setAdminCookie(pin);

    if (result.success) {
      router.push("/admin/dashboard");
    } else {
      setError("PIN Incorreto");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8 bg-slate-900 border-slate-800 text-white space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold">Acesso Restrito</h1>
          <p className="text-slate-400 text-sm">
            Digite o PIN mestre para acessar
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="PIN"
            className="bg-slate-950 border-slate-700 text-white text-center tracking-[1em] font-mono text-xl h-14 placeholder:tracking-normal"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && (
            <p className="text-red-500 text-center text-sm font-medium animate-pulse">
              {error}
            </p>
          )}

          <Button
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-bold"
            onClick={handleLogin}
          >
            Entrar no Sistema
          </Button>
        </div>
      </Card>
    </div>
  );
}
