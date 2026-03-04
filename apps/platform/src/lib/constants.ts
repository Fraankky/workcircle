export const CATEGORY_LABELS: Record<string, string> = {
  tech: "Tech",
  creative: "Creative",
  business: "Business",
  productivity: "Productivity",
  casual: "Casual",
};

export const VIBES = [
  "Fokus & Silent",
  "Kreatif & Kolaboratif",
  "Santai & Ngobrol",
  "Produktif & Energik",
  "Campuran",
];

export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    features: ["Bergabung ke grup (max 3)", "Lihat semua grup & spaces"],
  },
  pro: {
    label: "Pro",
    price: 49_000,
    features: ["Buat grup (max 3)", "Bergabung tanpa batas", "Profil premium"],
  },
  team: {
    label: "Team",
    price: 149_000,
    features: ["Buat grup (max 10)", "Semua fitur Pro", "Prioritas support"],
  },
} as const;

export const CHAT_TYPE_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  discord: "Discord",
};

export const WIFI_LABELS: Record<string, string> = {
  slow: "WiFi Lambat",
  medium: "WiFi Sedang",
  fast: "WiFi Kencang",
  very_fast: "WiFi Sangat Cepat",
};

export const NOISE_LABELS: Record<string, string> = {
  quiet: "Tenang",
  medium: "Sedang",
  buzzy: "Agak Ramai",
  loud: "Ramai",
};

export const SCHEDULES = [
  "Setiap Senin",
  "Setiap Selasa",
  "Setiap Rabu",
  "Setiap Kamis",
  "Setiap Jumat",
  "Setiap Sabtu",
  "Setiap Minggu",
  "Senin & Rabu",
  "Selasa & Kamis",
  "Sabtu & Minggu",
  "Setiap hari kerja",
];
