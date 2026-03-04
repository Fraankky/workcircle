import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";
import { GroupForm } from "../../modules/groups/components/group-form";
import { BackLink } from "../../components/ui/back-link";
import { PageHeader } from "../../components/ui/page-header";

export function GroupNewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleSuccess(groupId: string) {
    navigate({ to: "/groups/$id", params: { id: groupId } });
  }

  if (user?.plan === "free") {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-surface rounded border border-border p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-accent-dim rounded flex items-center justify-center mx-auto">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-fg">
              Fitur Premium
            </h2>
            <p className="text-sm text-muted mt-1">
              Upgrade ke Pro atau Team untuk membuat dan mengelola grup kerjamu sendiri.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/upgrade"
              className="w-full bg-accent text-bg text-sm font-medium py-2.5 rounded hover:bg-accent-glow transition-colors text-center"
            >
              Lihat Paket Premium
            </Link>
            <Link
              to="/discover"
              className="text-xs text-muted hover:text-fg transition-colors"
            >
              Kembali ke Discover
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5 p-6">
      <div className="space-y-3">
        <BackLink to="/discover" />
        <PageHeader title="Buat Grup Baru" subtitle="Isi detail grup kerjamu dan mulai kumpulkan anggota." />
      </div>

      <div className="bg-surface rounded border border-border p-5">
        <GroupForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
