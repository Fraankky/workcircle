import { useAuthRedirect } from "../lib/hooks/use-auth-redirect";
import { AuthPageShell } from "../components/ui/auth-page-shell";
import { RegisterForm } from "../modules/auth/components/register-form";

export function RegisterPage() {
  useAuthRedirect();

  return (
    <AuthPageShell subtitle="Buat akun baru">
      <RegisterForm />
    </AuthPageShell>
  );
}
