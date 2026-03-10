import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const PASSWORD_HASH = bcrypt.hashSync("password123", 10);

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data (order matters for FK constraints)
  await prisma.groupJoinRequest.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.group.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  // ──── Users (4 akun demo) ────
  console.log("Creating users...");

  // FREE user — perspektif "new user" yang explore & join grup
  const andi = await prisma.user.create({
    data: {
      email: "andi@example.com",
      password: PASSWORD_HASH,
      name: "Andi Wijaya",
      bio: "UI Designer yang suka ngopi sambil kerja. 2 tahun WFH dan mulai rindu interaksi sosial.",
      jobTitle: "UI/UX Designer",
      company: "Tokopedia",
      location: "Jakarta Selatan",
      profileComplete: true,
      plan: "free",
    },
  });

  // PRO user — admin 2 grup (untuk demo fitur admin & PRO)
  const sari = await prisma.user.create({
    data: {
      email: "sari@example.com",
      password: PASSWORD_HASH,
      name: "Sari Dewi",
      bio: "Frontend developer & tech enthusiast. Suka ngoding bareng orang lain, lebih produktif.",
      jobTitle: "Senior Frontend Engineer",
      company: "Gojek",
      location: "Jakarta Selatan",
      profileComplete: true,
      plan: "pro",
    },
  });

  // PRO user — admin 1 grup, member di grup lain
  const budi = await prisma.user.create({
    data: {
      email: "budi@example.com",
      password: PASSWORD_HASH,
      name: "Budi Santoso",
      bio: "Product manager yang suka networking dan diskusi strategi bisnis sambil ngopi.",
      jobTitle: "Product Manager",
      company: "Traveloka",
      location: "Jakarta Pusat",
      profileComplete: true,
      plan: "pro",
    },
  });

  // TEAM user — admin 1 grup (untuk demo plan TEAM)
  const rina = await prisma.user.create({
    data: {
      email: "rina@example.com",
      password: PASSWORD_HASH,
      name: "Rina Kusuma",
      bio: "Creative Director dengan passion di branding dan design system.",
      jobTitle: "Creative Director",
      company: "Bukalapak",
      location: "Bandung",
      profileComplete: true,
      plan: "team",
    },
  });

  // ──── Spaces (3 lokasi, cukup untuk demo map & filter) ────
  console.log("Creating spaces...");

  const kopitiam = await prisma.space.create({
    data: {
      name: "Kopitiam Senopati",
      area: "Jakarta Selatan",
      address: "Jl. Senopati No. 45, Kebayoran Baru",
      latitude: -6.2297,
      longitude: 106.8046,
      wifiSpeed: "fast",
      noiseLevel: "medium",
      hasPower: true,
      priceRange: "50k-100k",
      rating: 4.5,
      seatCount: 30,
    },
  });

  const maxy = await prisma.space.create({
    data: {
      name: "MAXY Academy",
      area: "Jakarta Selatan",
      address: "Jl. Casablanca Raya No. 88",
      latitude: -6.2344,
      longitude: 106.8408,
      wifiSpeed: "very_fast",
      noiseLevel: "quiet",
      hasPower: true,
      priceRange: "100k-200k",
      rating: 4.8,
      seatCount: 50,
    },
  });

  const kolega = await prisma.space.create({
    data: {
      name: "Kolega Co-Working",
      area: "Jakarta Pusat",
      address: "Jl. Thamrin No. 15, Menteng",
      latitude: -6.1944,
      longitude: 106.8229,
      wifiSpeed: "very_fast",
      noiseLevel: "quiet",
      hasPower: true,
      priceRange: "120k-250k",
      rating: 4.7,
      seatCount: 60,
    },
  });

  // ──── Additional Spaces: Jakarta Coffee Shops & Coworking ────
  console.log("Creating additional spaces...");

  const commonGround = await prisma.space.create({
    data: {
      name: "Common Ground Kuningan",
      area: "Kuningan",
      address: "Jl. HR Rasuna Said Kav. 62, Kuningan, Jakarta Selatan",
      latitude: -6.2281,
      longitude: 106.8314,
      wifiSpeed: "very_fast",
      noiseLevel: "medium",
      hasPower: true,
      priceRange: "150k-300k",
      rating: 4.8,
      seatCount: 80,
    },
  });

  const coLabs = await prisma.space.create({
    data: {
      name: "CoLabs Kuningan",
      area: "Kuningan",
      address: "Jl. Prof. Dr. Satrio No. 18, Kuningan, Jakarta Selatan",
      latitude: -6.2265,
      longitude: 106.8305,
      wifiSpeed: "fast",
      noiseLevel: "quiet",
      hasPower: true,
      priceRange: "100k-200k",
      rating: 4.6,
      seatCount: 45,
    },
  });

  const kumpul = await prisma.space.create({
    data: {
      name: "Kumpul Coworking Sudirman",
      area: "Sudirman",
      address: "Jl. Jend. Sudirman Kav. 52-53, SCBD, Jakarta Selatan",
      latitude: -6.2197,
      longitude: 106.8070,
      wifiSpeed: "very_fast",
      noiseLevel: "quiet",
      hasPower: true,
      priceRange: "100k-250k",
      rating: 4.7,
      seatCount: 60,
    },
  });

  const filosofiKopi = await prisma.space.create({
    data: {
      name: "Filosofi Kopi Melawai",
      area: "Blok M",
      address: "Jl. Melawai Raya No. 8, Kebayoran Baru, Jakarta Selatan",
      latitude: -6.2449,
      longitude: 106.7994,
      wifiSpeed: "fast",
      noiseLevel: "medium",
      hasPower: true,
      priceRange: "50k-100k",
      rating: 4.5,
      seatCount: 35,
    },
  });

  const conclave = await prisma.space.create({
    data: {
      name: "Conclave Kemang",
      area: "Kemang",
      address: "Jl. Kemang Raya No. 7, Kemang, Jakarta Selatan",
      latitude: -6.2619,
      longitude: 106.8113,
      wifiSpeed: "fast",
      noiseLevel: "buzzy",
      hasPower: true,
      priceRange: "80k-150k",
      rating: 4.4,
      seatCount: 40,
    },
  });

  const sejiwa = await prisma.space.create({
    data: {
      name: "Sejiwa Coffee Menteng",
      area: "Menteng",
      address: "Jl. Teuku Cik Ditiro No. 32, Menteng, Jakarta Pusat",
      latitude: -6.1941,
      longitude: 106.8327,
      wifiSpeed: "medium",
      noiseLevel: "quiet",
      hasPower: true,
      priceRange: "40k-80k",
      rating: 4.3,
      seatCount: 25,
    },
  });

  // ──── Groups (5 grup, cover semua category) ────
  console.log("Creating groups...");

  // [tech] requireApproval: true — untuk demo waitlist & approve/reject
  const techGroup = await prisma.group.create({
    data: {
      name: "Ngoding Bareng Jaksel",
      description:
        "Komunitas developer Jakarta Selatan untuk sharing dan coding bareng. Kita meetup rutin setiap minggu untuk belajar teknologi baru, code review, dan ngobrolin pengalaman kerja di industri tech.",
      category: "tech",
      adminId: sari.id,
      spaceId: kopitiam.id,
      schedule: "Setiap Rabu",
      timeStart: "19:00",
      timeEnd: "21:00",
      maxMembers: 10,
      vibe: "Fokus & Silent",
      tags: ["Coding", "JavaScript", "React", "Career"],
      color: "#6366F1",
      requireApproval: true,
      chatLink: "https://chat.whatsapp.com/ngodingjaksel",
      chatType: "whatsapp",
      isOpen: true,
    },
  });

  // [creative] requireApproval: true
  const designGroup = await prisma.group.create({
    data: {
      name: "Design Jam Session",
      description:
        "Sesekali designer perlu ketemu designer lain untuk share inspirasi dan feedback. Join kalau kamu UI/UX designer atau creative yang butuh komunitas dan peer review karya!",
      category: "creative",
      adminId: rina.id,
      spaceId: kopitiam.id,
      schedule: "Setiap Jumat",
      timeStart: "18:00",
      timeEnd: "20:00",
      maxMembers: 8,
      vibe: "Kreatif & Kolaboratif",
      tags: ["UI/UX", "Design System", "Portfolio Review", "Figma"],
      color: "#EC4899",
      requireApproval: true,
      chatLink: "https://t.me/designjamsession",
      chatType: "telegram",
      isOpen: true,
    },
  });

  // [business] requireApproval: true — ada pending request dari andi
  const startupGroup = await prisma.group.create({
    data: {
      name: "Startup Founders Circle",
      description:
        "Networking untuk founder dan co-founder startup di Jakarta. Sharing pengalaman fundraising, pitching session, growth hacks, dan potensi kolaborasi bisnis lintas industri.",
      category: "business",
      adminId: budi.id,
      spaceId: maxy.id,
      schedule: "Setiap Kamis",
      timeStart: "19:00",
      timeEnd: "21:30",
      maxMembers: 12,
      vibe: "Networking & Diskusi",
      tags: ["Startup", "Networking", "Pitching", "Fundraising"],
      color: "#10B981",
      requireApproval: true,
      isOpen: true,
    },
  });

  // [productivity] requireApproval: false — langsung bisa join tanpa approval
  const deepWorkGroup = await prisma.group.create({
    data: {
      name: "Deep Work Wednesday",
      description:
        "Fokus kerja tanpa distraksi bareng-bareng. Konsep Pomodoro bersama — 25 menit fokus, 5 menit break. Cocok untuk yang butuh accountability partner dan lingkungan kerja yang produktif.",
      category: "productivity",
      adminId: sari.id,
      spaceId: kolega.id,
      schedule: "Setiap Rabu",
      timeStart: "09:00",
      timeEnd: "17:00",
      maxMembers: 6,
      vibe: "Fokus & Silent",
      tags: ["Deep Work", "Productivity", "Pomodoro", "Remote Work"],
      color: "#8B5CF6",
      requireApproval: false,
      chatLink: "https://discord.gg/deepwork",
      chatType: "discord",
      isOpen: true,
    },
  });

  // [casual] requireApproval: false — grup santai, open untuk semua
  const ngopGroup = await prisma.group.create({
    data: {
      name: "Ngopi Sambil Kerja",
      description:
        "Yuk ngopi sambil ngerjain tugas atau project! Suasana santai tapi tetap produktif. Open untuk semua profesi. Tidak ada agenda formal — tinggal datang, pesan kopi, dan mulai kerja.",
      category: "casual",
      adminId: budi.id,
      spaceId: kopitiam.id,
      schedule: "Setiap Sabtu",
      timeStart: "10:00",
      timeEnd: "14:00",
      maxMembers: 15,
      vibe: "Santai & Ceria",
      tags: ["Casual", "Networking", "Coffee", "Fun"],
      color: "#F59E0B",
      requireApproval: false,
      isOpen: true,
    },
  });

  // ──── Group Members ────
  console.log("Creating memberships...");

  await prisma.groupMember.createMany({
    data: [
      // Admins sebagai member role:admin
      { userId: sari.id, groupId: techGroup.id, role: "admin" },
      { userId: rina.id, groupId: designGroup.id, role: "admin" },
      { userId: budi.id, groupId: startupGroup.id, role: "admin" },
      { userId: sari.id, groupId: deepWorkGroup.id, role: "admin" },
      { userId: budi.id, groupId: ngopGroup.id, role: "admin" },

      // andi: member di tech & deep work, sudah join
      { userId: andi.id, groupId: techGroup.id, role: "member" },
      { userId: andi.id, groupId: deepWorkGroup.id, role: "member" },
      { userId: andi.id, groupId: ngopGroup.id, role: "member" },

      // budi: member di tech group
      { userId: budi.id, groupId: techGroup.id, role: "member" },

      // rina: member di startup group
      { userId: rina.id, groupId: startupGroup.id, role: "member" },
    ],
  });

  // ──── Join Requests ────
  // (untuk demo tab Waitlist & flow approve/reject)
  console.log("Creating join requests...");

  await prisma.groupJoinRequest.createMany({
    data: [
      // pending — rina mau join tech group (untuk demo waitlist di sisi admin sari)
      {
        groupId: techGroup.id,
        userId: rina.id,
        status: "pending",
        message:
          "Halo! Saya Creative Director tapi lagi belajar coding untuk improve kolaborasi sama developer. Boleh join?",
      },
      // pending — andi mau join startup group (untuk demo waitlist di sisi admin budi)
      {
        groupId: startupGroup.id,
        userId: andi.id,
        status: "pending",
        message:
          "Saya lagi bikin side project dan butuh insight dari founder. Boleh join untuk networking?",
      },
      // approved — budi approved masuk design group (sudah di-review)
      {
        groupId: designGroup.id,
        userId: budi.id,
        status: "approved",
        message: "PM yang ingin belajar design thinking untuk product development.",
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  // ──── Subscriptions ────
  console.log("Creating subscriptions...");

  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.subscription.createMany({
    data: [
      {
        userId: sari.id,
        plan: "pro",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: thirtyDaysLater,
      },
      {
        userId: budi.id,
        plan: "pro",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: thirtyDaysLater,
      },
      {
        userId: rina.id,
        plan: "team",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: thirtyDaysLater,
      },
    ],
  });

  console.log("\n✅ Seeding completed!");
  console.log("\n🗺️  Spaces (9 total):");
  console.log("  Kuningan    → Common Ground Kuningan, CoLabs Kuningan");
  console.log("  Jaksel      → Kopitiam Senopati, MAXY Academy, Filosofi Kopi, Conclave Kemang");
  console.log("  Sudirman    → Kumpul Coworking");
  console.log("  Jakpus      → Kolega Co-Working, Sejiwa Coffee Menteng");
  console.log("\n📋 Demo accounts (password: password123):");
  console.log("  andi@example.com  → FREE  | member di Ngoding Bareng, Deep Work, Ngopi");
  console.log("                             | pending request ke Startup Founders Circle");
  console.log("  sari@example.com  → PRO   | admin: Ngoding Bareng Jaksel + Deep Work Wednesday");
  console.log("                             | ada 1 pending request masuk (dari Rina)");
  console.log("  budi@example.com  → PRO   | admin: Startup Founders Circle + Ngopi Sambil Kerja");
  console.log("                             | ada 1 pending request masuk (dari Andi)");
  console.log("  rina@example.com  → TEAM  | admin: Design Jam Session");
  console.log("                             | member di Startup Founders Circle");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
