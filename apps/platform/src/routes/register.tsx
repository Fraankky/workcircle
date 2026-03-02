import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../modules/auth/hooks";
import { RegisterForm } from "../modules/auth/components/register-form";

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate({ to: "/discover" });
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#58A6FF] tracking-tight">WorkCircle</h1>
          <p className="text-xs text-[#6E7681] mt-1 uppercase tracking-widest">Buat akun baru</p>
        </div>
        <div className="bg-[#161B22] rounded border border-[#30363D] p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
