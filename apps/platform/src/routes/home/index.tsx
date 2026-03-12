import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../modules/auth/hooks";

// ── Fade-in on scroll ──────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Counter animation ──────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return { count, start: () => setStarted(true) };
}

// ── 1. Navbar ──────────────────────────────────────────────────────────────────
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,7,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-white font-bold text-base tracking-tight">WorkCircle</span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">
            Fitur
          </a>
          <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">
            Harga
          </a>
          <a href="#faq" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-2">
            FAQ
          </a>
          <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm bg-white !text-[#07070A] font-semibold px-4 py-2 rounded hover:bg-white/90 transition-colors"
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/60 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4 flex flex-col gap-2"
          style={{ background: "rgba(7,7,10,0.97)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <a href="#features" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 py-2">Fitur</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 py-2">Harga</a>
          <a href="#faq" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 py-2">FAQ</a>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 py-2">Login</Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="text-sm bg-white !text-[#07070A] font-semibold px-4 py-2.5 rounded text-center mt-1"
          >
            Get Started →
          </Link>
        </div>
      )}
    </nav>
  );
}

// ── 2. Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-4 text-center">
      {/* Orb */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-32">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-white/40 text-xs mb-10 tracking-widest uppercase"
          style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 inline-block animate-pulse" />
          Platform Komunitas Profesional
        </div>

        <h1 className="text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold leading-none tracking-tight text-white mb-8">
          Your Community,
          <br />
          <span className="text-white/25">Organized.</span>
        </h1>

        <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto">
          WorkCircle adalah platform untuk menemukan, bergabung, dan membangun
          komunitas belajar & kelompok profesional — untuk wadah kolaborasi dan
          pengembangan karir.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="bg-white !text-[#07070A] font-semibold px-8 py-3.5 rounded hover:bg-white/90 transition-colors text-sm"
          >
            Mulai Gratis →
          </Link>
          <a
            href="#features"
            className="text-sm text-white/60 hover:text-white transition-colors px-8 py-3.5 rounded border border-white/10 hover:border-white/20"
          >
            Lihat Fitur
          </a>
        </div>

        <p className="text-white/20 text-xs mt-8 tracking-wide">
          Gratis untuk bergabung. Upgrade kapan saja.
        </p>
      </div>
    </section>
  );
}

// ── 3. Proof Bar (Marquee) ─────────────────────────────────────────────────────
const PROOF_ITEMS = [
  "✦ 1.200+ Anggota Aktif",
  "✦ 300+ Grup Terdaftar",
  "✦ 50+ Spaces",
  "✦ 4.8★ Rating",
  "✦ 12+ Kota",
  "✦ Gratis untuk bergabung",
  "✦ 1.200+ Anggota Aktif",
  "✦ 300+ Grup Terdaftar",
  "✦ 50+ Spaces",
  "✦ 4.8★ Rating",
  "✦ 12+ Kota",
  "✦ Gratis untuk bergabung",
];

function ProofBar() {
  return (
    <div
      className="relative overflow-hidden py-4"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex gap-12 items-center landing-marquee whitespace-nowrap">
        {PROOF_ITEMS.map((item, i) => (
          <span key={i} className="text-sm shrink-0" style={{ color: "rgba(255,255,255,0.40)" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 4. Problem Section ─────────────────────────────────────────────────────────
function ProblemSection() {
  const { ref, visible } = useFadeIn();
  const CHAOS = [
    { icon: "💬", label: "WhatsApp Group", desc: "Pesan penting tenggelam dalam notifikasi" },
    { icon: "📹", label: "Link Zoom Hilang", desc: "Meeting link tersebar di berbagai chat" },
    { icon: "📧", label: "Email Berantakan", desc: "Update komunitas terkubur di inbox" },
  ];

  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div
        ref={ref}
        className="transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
      >
        <div className="text-center mb-16">
          <p className="text-white/30 text-xs tracking-widest uppercase mb-4">Masalah yang kamu hadapi</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Komunitas kamu<br />tersebar di mana-mana.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            WhatsApp group yang tidak terorganisir. Link Zoom yang hilang. Anggota baru
            bingung mau mulai dari mana. Diskusi berharga tenggelam di chat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {CHAOS.map((item) => (
            <div
              key={item.label}
              className="rounded border p-6 text-center"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div className="text-3xl mb-3 opacity-40">{item.icon}</div>
              <div className="text-white/40 font-medium text-sm mb-1">{item.label}</div>
              <div className="text-white/25 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded border"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
          >
            <span className="text-white/30 text-sm line-through">Semua itu</span>
            <span className="text-white/20">→</span>
            <span className="text-white font-semibold text-sm">WorkCircle menyatukan semua itu.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 5. Features Section ────────────────────────────────────────────────────────
const FEATURES = [
  {
    tag: "DISCOVER",
    headline: "Temukan Grup yang Relevan",
    body: "Jelajahi ratusan komunitas belajar, grup profesional, dan lingkaran minat. Filter berdasarkan kategori, jadwal, dan lokasi terdekat.",
    image: "/discover.png",
    imageAlt: "WorkCircle Discover Page",
    reverse: false,
  },
  {
    tag: "GROUPS",
    headline: "Bangun Komunitas Kamu Sendiri",
    body: "Buat grup dengan deskripsi, jadwal rutin, tag topik, dan link diskusi. Kelola anggota, setujui permintaan bergabung, dan pantau aktivitas — semua dari satu dashboard yang bersih.",
    image: null,
    imageAlt: "",
    reverse: true,
  },
  {
    tag: "SPACES",
    headline: "Ruang Nyata untuk Bertemu",
    body: "Temukan co-working space, kafe, dan venue komunitas di sekitarmu. Peta interaktif dengan filter kapasitas dan fasilitas.",
    image: "/spaces.png",
    imageAlt: "WorkCircle Spaces Map",
    reverse: false,
  },
  {
    tag: "PRO",
    headline: "Lebih Banyak Grup, Lebih Banyak Koneksi",
    body: "Upgrade ke Pro untuk bergabung ke grup tak terbatas, akses fitur eksklusif, dan tampil lebih menonjol di komunitas. Hanya Rp 14.000/bulan.",
    image: null,
    imageAlt: "",
    reverse: true,
  },
];

function GroupsIllustration() {
  return (
    <div className="w-full max-w-sm mx-auto rounded border p-5 space-y-3"
      style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)" }}>
      <div className="text-white/30 text-xs uppercase tracking-widest mb-4">Kelola Anggota</div>
      {[
        { name: "Raka S.", role: "Admin", badge: "admin" },
        { name: "Dina P.", role: "Member", badge: null },
        { name: "Yusuf M.", role: "Pending", badge: "pending" },
      ].map((m) => (
        <div key={m.name} className="flex items-center justify-between py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)" }}>
              {m.name[0]}
            </div>
            <span className="text-sm text-white/70">{m.name}</span>
          </div>
          {m.badge === "admin" && (
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)" }}>ADMIN</span>
          )}
          {m.badge === "pending" && (
            <div className="flex gap-1.5">
              <button className="text-[10px] px-2 py-0.5 rounded text-white/60 border border-white/10 hover:bg-white/10">✓</button>
              <button className="text-[10px] px-2 py-0.5 rounded text-white/30 border border-white/5 hover:bg-white/5">✕</button>
            </div>
          )}
        </div>
      ))}
      <div className="pt-2 text-white/25 text-xs">3 anggota · 1 menunggu approval</div>
    </div>
  );
}

function ProIllustration() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <div className="rounded border p-5"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/50 text-sm">Paket kamu</span>
          <span className="text-[10px] px-2 py-0.5 rounded font-bold tracking-wider"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>PRO</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1">Rp 14.000</div>
        <div className="text-white/30 text-xs">per bulan · batalkan kapan saja</div>
      </div>
      <div className="space-y-2">
        {["Grup unlimited", "Priority feed", "Badge Pro di profil", "Akses fitur eksklusif"].map((f) => (
          <div key={f} className="flex items-center gap-2 text-sm text-white/60">
            <span className="text-white/40">✓</span> {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureBlock({ feat }: { feat: typeof FEATURES[number] }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${
        feat.reverse ? "md:[direction:rtl]" : ""
      }`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)" }}
    >
      {/* Text */}
      <div className={feat.reverse ? "md:[direction:ltr]" : ""}>
        <span className="text-[10px] tracking-widest text-white/30 uppercase border border-white/10 px-2 py-1 rounded">
          {feat.tag}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-white mt-5 mb-4">{feat.headline}</h3>
        <p className="text-white/50 leading-relaxed">{feat.body}</p>
      </div>

      {/* Visual */}
      <div className={`flex items-center justify-center ${feat.reverse ? "md:[direction:ltr]" : ""}`}>
        {feat.image ? (
          <div
            className="relative w-full max-w-sm rounded border overflow-hidden shadow-xl"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)", backdropFilter: "blur(14px)" }}
          >
            <img src={feat.image} alt={feat.imageAlt} className="w-full opacity-90 block" />
            <div className="absolute inset-0 bg-linear-to-t from-bg/40 to-transparent pointer-events-none" />
          </div>
        ) : feat.tag === "GROUPS" ? (
          <GroupsIllustration />
        ) : (
          <ProIllustration />
        )}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-white/30 text-xs tracking-widest uppercase mb-4">Fitur Utama</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Semua yang kamu butuhkan
          </h2>
        </div>

        <div className="space-y-28">
          {FEATURES.map((feat) => (
            <FeatureBlock key={feat.tag} feat={feat} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 6. How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const { ref, visible } = useFadeIn();
  const STEPS = [
    { num: "01", title: "Daftar Gratis", desc: "Buat akun dalam 30 detik. Tidak perlu kartu kredit." },
    { num: "02", title: "Pilih Minatmu", desc: "Onboarding 2 langkah — pilih kategori yang relevan untukmu." },
    { num: "03", title: "Bergabung & Grow", desc: "Join grup, temukan spaces, expand network kamu." },
  ];

  return (
    <section className="py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className="transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          <div className="text-center mb-16">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-4">Cara Kerja</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Mulai dalam 3 langkah</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="rounded border p-8 relative"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(14px)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className="text-5xl font-bold mb-6 leading-none"
                  style={{ color: "rgba(255,255,255,0.07)" }}
                >
                  {step.num}
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 7. Stats Section ───────────────────────────────────────────────────────────
const STATS = [
  { target: 1200, suffix: "+", label: "Anggota Terdaftar" },
  { target: 300, suffix: "+", label: "Grup Aktif" },
  { target: 50, suffix: "+", label: "Spaces Tersedia" },
  { target: 12, suffix: "+", label: "Kota Terjangkau" },
];

function StatCard({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { count, start } = useCounter(target);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          start();
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded border p-8 text-center transition-all duration-700"
      style={{
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString("id-ID")}{suffix}
      </div>
      <div className="text-white/40 text-sm">{label}</div>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}

// ── 8. Testimonials ────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "WorkCircle bikin saya akhirnya bisa nemuin grup Rust yang serius. Dalam seminggu langsung ada meetup.",
    name: "Raka Satria",
    role: "Software Engineer",
    initials: "RS",
  },
  {
    quote: "Akhirnya ada platform yang bersih buat komunitas desainer. Bisa lihat semua event dan spaces di satu tempat.",
    name: "Dina Pratiwi",
    role: "UI/UX Designer",
    initials: "DP",
  },
  {
    quote: "Upgrade ke Pro worth it banget. Bisa join banyak grup sekaligus dan koneksi profesional saya bertambah 3x.",
    name: "Yusuf Malik",
    role: "Freelance Developer",
    initials: "YM",
  },
];

function TestimonialsSection() {
  const { ref, visible } = useFadeIn();
  return (
    <section className="py-24" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className="transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          <div className="text-center mb-16">
            <p className="text-white/30 text-xs tracking-widest uppercase mb-4">Testimoni</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Kata mereka</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="rounded border p-7 flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(14px)",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)" }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{t.name}</div>
                    <div className="text-white/30 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 9. Pricing Section ─────────────────────────────────────────────────────────
function PricingSection() {
  const { ref, visible } = useFadeIn();
  const FREE_FEATURES = [
    { text: "Max 3 grup", ok: true },
    { text: "Discover & Spaces map", ok: true },
    { text: "Profil publik", ok: true },
    { text: "Priority feed", ok: false },
    { text: "Badge Pro di profil", ok: false },
    { text: "Grup unlimited", ok: false },
  ];
  const PRO_FEATURES = [
    { text: "Grup unlimited", ok: true },
    { text: "Semua fitur Free", ok: true },
    { text: "Badge Pro di profil", ok: true },
    { text: "Priority feed", ok: true },
    { text: "Akses fitur eksklusif", ok: true },
    { text: "Batalkan kapan saja", ok: true },
  ];

  return (
    <section id="pricing" className="py-24 max-w-6xl mx-auto px-6">
      <div
        ref={ref}
        className="transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
      >
        <div className="text-center mb-16">
          <p className="text-white/30 text-xs tracking-widest uppercase mb-4">Harga</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Sederhana & Terjangkau</h2>
          <p className="text-white/40 mt-4">Mulai gratis. Upgrade ketika siap.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div
            className="rounded border p-8 flex flex-col"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(14px)" }}
          >
            <div className="text-white/40 text-sm font-medium tracking-wider uppercase mb-6">Free</div>
            <div className="text-4xl font-bold text-white mb-1">Rp 0</div>
            <div className="text-white/30 text-xs mb-8">selamanya gratis</div>
            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <span style={{ color: f.ok ? "rgba(255,255,255,0.50)" : "rgba(255,255,255,0.15)" }}>
                    {f.ok ? "✓" : "✕"}
                  </span>
                  <span style={{ color: f.ok ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.25)" }}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="block text-center text-sm py-3 rounded border border-white/15 text-white/60 hover:border-white/25 hover:text-white transition-colors"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Pro */}
          <div
            className="rounded border p-8 flex flex-col relative"
            style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.20)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 0 40px rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-3 py-1 rounded font-bold tracking-widest"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
            >
              PALING POPULER
            </div>
            <div className="text-white text-sm font-medium tracking-wider uppercase mb-6">Pro ★</div>
            <div className="text-4xl font-bold text-white mb-1">Rp 14.000</div>
            <div className="text-white/30 text-xs mb-8">per bulan</div>
            <ul className="space-y-3 flex-1 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <span className="text-white/60">✓</span>
                  <span className="text-white/70">{f.text}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="block text-center text-sm py-3 rounded bg-white !text-[#07070A] font-semibold hover:bg-white/90 transition-colors"
            >
              Upgrade Sekarang →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 10. Trust / Security Block ─────────────────────────────────────────────────
function TrustSection() {
  const { ref, visible } = useFadeIn();
  const TRUST = [
    { icon: "🔒", title: "Data Aman", desc: "Semua data disimpan terenkripsi di infrastruktur Neon PostgreSQL." },
    { icon: "🛡️", title: "Privacy First", desc: "Tidak ada iklan, tidak ada tracking pihak ketiga. Data kamu tidak dijual." },
    { icon: "✉️", title: "Email Terverifikasi", desc: "Akun hanya aktif setelah verifikasi email — tidak ada akun palsu." },
  ];

  return (
    <section
      className="py-20"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ref}
          className="grid md:grid-cols-3 gap-8 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
        >
          {TRUST.map((t) => (
            <div key={t.title} className="flex gap-4">
              <div className="text-2xl shrink-0 opacity-60">{t.icon}</div>
              <div>
                <div className="text-white font-medium text-sm mb-1">{t.title}</div>
                <div className="text-white/40 text-xs leading-relaxed">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 11. FAQ Section ────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Apakah WorkCircle gratis?", a: "Ya, ada tier gratis selamanya. Kamu bisa bergabung ke maksimal 3 grup, explore Discover, dan lihat Spaces map. Upgrade ke Pro (Rp 14.000/bln) untuk fitur lebih." },
  { q: "Bagaimana cara bergabung ke grup?", a: "Cari di halaman Discover, klik tombol Join. Beberapa grup langsung otomatis, beberapa butuh approval dari admin grup." },
  { q: "Bisa buat grup sendiri?", a: "Ya, siapapun bisa membuat grup dan menjadi admin. Kamu bisa set requirement approval, jadwal, kategori, tag, dan link diskusi." },
  { q: "Apa itu Spaces?", a: "Spaces adalah lokasi fisik — co-working space, kafe, library, atau venue komunitas — yang bisa kamu temukan lewat peta interaktif." },
  { q: "Apakah data saya aman?", a: "Ya. Data disimpan di infrastruktur Neon PostgreSQL dan file di Cloudflare R2. Tidak ada iklan, tidak ada tracking pihak ketiga." },
  { q: "Bagaimana cara upgrade ke Pro?", a: "Dari menu Upgrade di sidebar, pilih paket Pro, lalu bayar via Mayar (transfer bank / QRIS). Akses Pro aktif langsung setelah pembayaran." },
  { q: "Bisa cancel kapan saja?", a: "Ya, tidak ada kontrak panjang. Cancel kapan saja, akses Pro tetap aktif hingga akhir periode." },
  { q: "Ada mobile app?", a: "Belum ada mobile app native, tapi WorkCircle sudah fully mobile-responsive dan bisa dibuka nyaman di browser HP." },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, visible } = useFadeIn();

  return (
    <section id="faq" className="py-24 max-w-4xl mx-auto px-6">
      <div
        ref={ref}
        className="transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
      >
        <div className="text-center mb-16">
          <p className="text-white/30 text-xs tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Pertanyaan Umum</h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded border overflow-hidden"
              style={{ borderColor: open === i ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-white/80 text-sm font-medium pr-4">{faq.q}</span>
                <span
                  className="text-white/30 shrink-0 transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 12. Final CTA + Footer ─────────────────────────────────────────────────────
function LandingFooter() {
  const { ref, visible } = useFadeIn();
  return (
    <footer>
      {/* CTA block */}
      <section
        className="py-24 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          ref={ref}
          className="max-w-2xl mx-auto px-6 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Siap bergabung?
          </h2>
          <p className="text-white/40 mb-10 leading-relaxed">
            Tidak perlu kartu kredit. Daftar dalam 30 detik.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white !text-[#07070A] font-semibold px-8 py-3.5 rounded hover:bg-white/90 transition-colors text-sm"
            >
              Mulai Gratis →
            </Link>
            <Link
              to="/login"
              className="text-white/60 hover:text-white transition-colors text-sm px-6 py-3.5 rounded border border-white/10 hover:border-white/20"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer links */}
      <div
        className="py-12 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <div className="text-white font-bold mb-3">WorkCircle</div>
            <div className="text-white/25 text-xs leading-relaxed">
              Platform komunitas profesional untuk belajar, berkolaborasi, dan berkembang bersama.
            </div>
            <div className="text-white/15 text-xs mt-4">© 2026 WorkCircle</div>
          </div>

          <div>
            <div className="text-white/50 text-xs uppercase tracking-widest mb-4">Produk</div>
            <ul className="space-y-2">
              {[["Discover", "/discover"], ["Groups", "/groups"], ["Spaces", "/spaces"], ["Upgrade", "/upgrade"]].map(([label, href]) => (
                <li key={label}>
                  <Link to={href as "/discover" | "/groups" | "/spaces" | "/upgrade"} className="text-white/30 hover:text-white/60 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-white/50 text-xs uppercase tracking-widest mb-4">Akun</div>
            <ul className="space-y-2">
              {[["Login", "/login"], ["Daftar", "/register"]].map(([label, href]) => (
                <li key={label}>
                  <Link to={href as "/login" | "/register"} className="text-white/30 hover:text-white/60 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-white/50 text-xs uppercase tracking-widest mb-4">Legal</div>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Kontak"].map((label) => (
                <li key={label}>
                  <span className="text-white/20 text-sm cursor-default">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Root LandingPage ───────────────────────────────────────────────────────────
export function LandingPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: "/discover" });
    }
  }, [user, isLoading]);

  // Show nothing while checking auth (avoids flash)
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#07070A" }}
      >
        <div className="w-4 h-4 rounded-full border border-white/20 border-t-white/60 animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: "#07070A", color: "#FFFFFF", minHeight: "100vh" }}>
      <LandingNav />
      <HeroSection />
      <ProofBar />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <TrustSection />
      <FaqSection />
      <LandingFooter />
    </div>
  );
}
