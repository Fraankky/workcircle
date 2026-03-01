import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../modules/auth/hooks";
import { LoginForm } from "../modules/auth/components/login-form";

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) navigate({ to: "/discover" });
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">WorkCircle</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke akunmu</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
