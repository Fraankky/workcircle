import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";

const CATEGORIES = [
  { key: "tech", label: "Tech", desc: "Dev, data, produk digital" },
  { key: "creative", label: "Creative", desc: "Desain, konten, media" },
  { key: "business", label: "Business", desc: "Startup, marketing, sales" },
  { key: "productivity", label: "Productivity", desc: "Deep work, sistem, GTD" },
  { key: "casual", label: "Casual", desc: "Santai, ngobrol, fleksibel" },
] as const;

const LS_KEY = "wc_interests";

export function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(key: string) {
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length < 3
          ? [...prev, key]
          : prev,
    );
  }

  function finish() {
    if (selected.length > 0) {
      localStorage.setItem(LS_KEY, JSON.stringify(selected));
    }
    navigate({ to: "/discover" });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Gradient orbs (sama seperti __root) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(67,56,202,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs font-medium text-faint uppercase tracking-widest">WorkCircle</p>
          <h1 className="text-2xl font-bold text-fg">
            Hei{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="text-sm text-muted">
            Pilih topik yang paling relevan buat kamu.
            <br />
            Kami akan tampilkan grup yang paling cocok.
          </p>
        </div>

        {/* Category picker */}
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => toggle(cat.key)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded border text-left transition-all ${
                  isSelected
                    ? "border-ascent bg-accent-dim text-fg"
                    : "border-border bg-surface text-muted hover:border-overlay hover:text-fg"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-ascent border-ascent" : "border-border"
                  }`}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-bg">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{cat.label}</p>
                  <p className="text-xs text-faint">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-xs text-faint">
          {selected.length === 0
            ? "Pilih 1–3 topik"
            : `${selected.length} dipilih${selected.length === 3 ? " (maksimal)" : ""}`}
        </p>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={finish}
            className="w-full bg-accent text-bg text-sm font-semibold py-3 rounded hover:bg-accent-glow transition-colors"
          >
            Mulai Explore
          </button>
          <button
            onClick={() => navigate({ to: "/discover" })}
            className="w-full text-xs text-faint hover:text-muted transition-colors py-1"
          >
            Lewati
          </button>
        </div>
      </div>
    </div>
  );
}
