import { useAuthRedirect } from "../lib/hooks/use-auth-redirect";
import { AuthPageShell } from "../components/ui/auth-page-shell";
import { LoginForm } from "../modules/auth/components/login-form";

export function LoginPage() {
  useAuthRedirect();

  return (
    <AuthPageShell subtitle="Masuk ke akunmu">
      <LoginForm />
    </AuthPageShell>
  );
}
