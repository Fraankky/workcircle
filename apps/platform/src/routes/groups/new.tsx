import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";
import { GroupForm } from "../../modules/groups/components/group-form";

export function GroupNewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleSuccess(groupId: string) {
    navigate({ to: "/groups/$id", params: { id: groupId } });
  }

  if (user?.plan === "free") {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-[#161B22] rounded border border-[#30363D] p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-[#1F3558] rounded flex items-center justify-center mx-auto">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#58A6FF]"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#C9D1D9]">
              Fitur Premium
            </h2>
            <p className="text-sm text-[#8B949E] mt-1">
              Upgrade ke Pro atau Team untuk membuat dan mengelola grup kerjamu sendiri.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              to="/upgrade"
              className="w-full bg-[#58A6FF] text-[#0D1117] text-sm font-medium py-2.5 rounded hover:bg-[#388BFD] transition-colors text-center"
            >
              Lihat Paket Premium
            </Link>
            <Link
              to="/discover"
              className="text-xs text-[#6E7681] hover:text-[#C9D1D9] transition-colors"
            >
              Kembali ke Discover
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <Link
          to="/discover"
          className="inline-flex items-center gap-1 text-xs text-[#6E7681] hover:text-[#C9D1D9] transition-colors mb-4"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali
        </Link>
        <h1 className="text-lg font-bold text-[#C9D1D9]">Buat Grup Baru</h1>
        <p className="text-xs text-[#6E7681] mt-0.5">
          Isi detail grup kerjamu dan mulai kumpulkan anggota.
        </p>
      </div>

      <div className="bg-[#161B22] rounded border border-[#30363D] p-5">
        <GroupForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
