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

  // ──── Users ────
  console.log("Creating users...");

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

  const sari = await prisma.user.create({
    data: {
      email: "sari@example.com",
      password: PASSWORD_HASH,
      name: "Sari Dewi",
      bio: "Frontend developer & tech enthusiast. Suka ngoding bareng orang lain lebih produktif.",
      jobTitle: "Senior Frontend Engineer",
      company: "Gojek",
      location: "Jakarta Selatan",
      profileComplete: true,
      plan: "pro",
    },
  });

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

  const rina = await prisma.user.create({
    data: {
      email: "rina@example.com",
      password: PASSWORD_HASH,
      name: "Rina Kusuma",
      bio: "Creative Director dengan passion di branding dan design system. Bandung based.",
      jobTitle: "Creative Director",
      company: "Bukalapak",
      location: "Bandung",
      profileComplete: true,
      plan: "team",
    },
  });

  const dika = await prisma.user.create({
    data: {
      email: "dika@example.com",
      password: PASSWORD_HASH,
      name: "Dika Pratama",
      bio: "Full stack developer freelance. Biasanya kerja dari cafe, cari teman ngoding!",
      jobTitle: "Full Stack Developer",
      company: "Freelance",
      location: "Jakarta Barat",
      profileComplete: true,
      plan: "free",
    },
  });

  const mega = await prisma.user.create({
    data: {
      email: "mega@example.com",
      password: PASSWORD_HASH,
      name: "Mega Pratiwi",
      bio: "Content strategist & copywriter. Remote worker yang aktif networking.",
      jobTitle: "Content Strategist",
      company: "Ruangguru",
      location: "Jakarta Selatan",
      profileComplete: true,
      plan: "pro",
    },
  });

  const rizki = await prisma.user.create({
    data: {
      email: "rizki@example.com",
      password: PASSWORD_HASH,
      name: "Rizki Hermawan",
      bio: "Data scientist yang kerja hybrid. Cari co-working buddy untuk hari WFH.",
      jobTitle: "Data Scientist",
      company: "Shopee",
      location: "Jakarta Barat",
      profileComplete: true,
      plan: "free",
    },
  });

  // ──── Spaces ────
  console.log("Creating spaces...");

  const kopitiam = await prisma.space.create({
    data: {
      name: "Kopitiam Senopati",
      area: "Jakarta Selatan",
      address: "Jl. Senopati No. 45, Kebayoran Baru",
      wifiSpeed: "fast",
      noiseLevel: "medium",
      hasPower: true,
      priceRange: "50k-100k",
      rating: 4.5,
      seatCount: 30,
    },
  });

  const kopiSoe = await prisma.space.create({
    data: {
      name: "Kopi Soe Kemang",
      area: "Jakarta Selatan",
      address: "Jl. Kemang Selatan No. 12",
      wifiSpeed: "medium",
      noiseLevel: "buzzy",
      hasPower: true,
      priceRange: "30k-60k",
      rating: 4.2,
      seatCount: 25,
    },
  });

  const maxy = await prisma.space.create({
    data: {
      name: "MAXY Academy",
      area: "Jakarta Selatan",
      address: "Jl. Casablanca Raya No. 88",
      wifiSpeed: "very_fast",
      noiseLevel: "quiet",
      hasPower: true,
      priceRange: "100k-200k",
      rating: 4.8,
      seatCount: 50,
    },
  });

  const conclave = await prisma.space.create({
    data: {
      name: "Conclave",
      area: "Jakarta Selatan",
      address: "Jl. Wijaya II No. 20",
      wifiSpeed: "fast",
      noiseLevel: "medium",
      hasPower: true,
      priceRange: "150k-300k",
      rating: 4.6,
      seatCount: 40,
    },
  });

  const twoSpace = await prisma.space.create({
    data: {
      name: "TwoSpace",
      area: "Bandung",
      address: "Jl. Dago No. 99",
      wifiSpeed: "fast",
      noiseLevel: "medium",
      hasPower: true,
      priceRange: "80k-150k",
      rating: 4.4,
      seatCount: 35,
    },
  });

  const tokoTuku = await prisma.space.create({
    data: {
      name: "Toko Kopi Tuku",
      area: "Jakarta Selatan",
      address: "Jl. Cipete Raya No. 7",
      wifiSpeed: "medium",
      noiseLevel: "buzzy",
      hasPower: false,
      priceRange: "20k-40k",
      rating: 4.0,
      seatCount: 15,
    },
  });

  const cospace = await prisma.space.create({
    data: {
      name: "Kolega Co-Working",
      area: "Jakarta Pusat",
      address: "Jl. Thamrin No. 15, Menteng",
      wifiSpeed: "very_fast",
      noiseLevel: "quiet",
      hasPower: true,
      priceRange: "120k-250k",
      rating: 4.7,
      seatCount: 60,
    },
  });

  const dago = await prisma.space.create({
    data: {
      name: "Dago Café & Work",
      area: "Bandung",
      address: "Jl. Ir. H. Juanda No. 33",
      wifiSpeed: "fast",
      noiseLevel: "medium",
      hasPower: true,
      priceRange: "40k-80k",
      rating: 4.3,
      seatCount: 20,
    },
  });

  // ──── Groups ────
  console.log("Creating groups...");

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

  const designGroup = await prisma.group.create({
    data: {
      name: "Design Jam Session",
      description:
        "Sesekali designer perlu ketemu designer lain untuk share inspirasi dan feedback. Join kalau kamu UI/UX designer, illustrator, atau creative yang butuh komunitas dan peer review karya!",
      category: "creative",
      adminId: rina.id,
      spaceId: kopiSoe.id,
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

  const deepWorkGroup = await prisma.group.create({
    data: {
      name: "Deep Work Wednesday",
      description:
        "Fokus kerja tanpa distraksi bareng-bareng. Konsep Pomodoro bersama — 25 menit fokus, 5 menit break. Cocok untuk yang butuh accountability partner dan lingkungan kerja yang produktif.",
      category: "productivity",
      adminId: sari.id,
      spaceId: conclave.id,
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

  const ngopGroup = await prisma.group.create({
    data: {
      name: "Ngopi Sambil Kerja",
      description:
        "Yuk ngopi sambil ngerjain tugas atau project! Suasana santai tapi tetap produktif. Open untuk semua profesi. Tidak ada agenda formal — tinggal datang, pesan kopi, dan mulai kerja.",
      category: "casual",
      adminId: budi.id,
      spaceId: tokoTuku.id,
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

  const bandungTech = await prisma.group.create({
    data: {
      name: "Bandung Tech Hub",
      description:
        "Komunitas teknologi Bandung. Kita diskusi tech stack, career development, dan kerja bareng di coworking space. Terbuka untuk developer, designer, dan siapa saja di dunia tech.",
      category: "tech",
      adminId: rina.id,
      spaceId: twoSpace.id,
      schedule: "Setiap Minggu",
      timeStart: "13:00",
      timeEnd: "17:00",
      maxMembers: 8,
      vibe: "Kreatif & Kolaboratif",
      tags: ["Coding", "Bandung", "Tech Community", "Open Source"],
      color: "#3B82F6",
      requireApproval: true,
      isOpen: true,
    },
  });

  const contentGroup = await prisma.group.create({
    data: {
      name: "Content Creators Club",
      description:
        "Komunitas content creator, copywriter, dan marketer digital. Sharing strategi konten, tools terbaru, dan saling review konten. Cocok untuk yang kerja di media, agency, atau sebagai freelancer.",
      category: "creative",
      adminId: mega.id,
      spaceId: cospace.id,
      schedule: "Setiap Selasa",
      timeStart: "14:00",
      timeEnd: "17:00",
      maxMembers: 10,
      vibe: "Kreatif & Kolaboratif",
      tags: ["Content", "Copywriting", "Marketing", "Social Media"],
      color: "#F97316",
      requireApproval: true,
      chatLink: "https://chat.whatsapp.com/contentcreatorsclub",
      chatType: "whatsapp",
      isOpen: true,
    },
  });

  const morningGroup = await prisma.group.create({
    data: {
      name: "Morning Productivity Club",
      description:
        "Mulai hari dengan produktif! Kita kumpul pagi hari, review goals mingguan, dan fokus kerja bareng sampai siang. Cocok untuk early bird yang ingin konsisten dan tetap on track.",
      category: "productivity",
      adminId: mega.id,
      spaceId: kopitiam.id,
      schedule: "Setiap Senin & Kamis",
      timeStart: "07:30",
      timeEnd: "10:00",
      maxMembers: 8,
      vibe: "Fokus & Silent",
      tags: ["Morning Routine", "Goal Setting", "Productivity", "Accountability"],
      color: "#0EA5E9",
      requireApproval: true,
      isOpen: true,
    },
  });

  // ──── Group Members ────
  console.log("Creating memberships...");

  await prisma.groupMember.createMany({
    data: [
      // Admins as members (role: admin)
      { userId: sari.id, groupId: techGroup.id, role: "admin" },
      { userId: rina.id, groupId: designGroup.id, role: "admin" },
      { userId: budi.id, groupId: startupGroup.id, role: "admin" },
      { userId: sari.id, groupId: deepWorkGroup.id, role: "admin" },
      { userId: budi.id, groupId: ngopGroup.id, role: "admin" },
      { userId: rina.id, groupId: bandungTech.id, role: "admin" },
      { userId: mega.id, groupId: contentGroup.id, role: "admin" },
      { userId: mega.id, groupId: morningGroup.id, role: "admin" },

      // Regular members
      { userId: andi.id, groupId: techGroup.id, role: "member" },
      { userId: dika.id, groupId: techGroup.id, role: "member" },
      { userId: budi.id, groupId: techGroup.id, role: "member" },

      { userId: andi.id, groupId: designGroup.id, role: "member" },
      { userId: sari.id, groupId: designGroup.id, role: "member" },

      { userId: rina.id, groupId: startupGroup.id, role: "member" },
      { userId: sari.id, groupId: startupGroup.id, role: "member" },

      { userId: andi.id, groupId: deepWorkGroup.id, role: "member" },
      { userId: rizki.id, groupId: deepWorkGroup.id, role: "member" },

      { userId: andi.id, groupId: ngopGroup.id, role: "member" },
      { userId: dika.id, groupId: ngopGroup.id, role: "member" },
      { userId: rizki.id, groupId: ngopGroup.id, role: "member" },

      { userId: dika.id, groupId: bandungTech.id, role: "member" },

      { userId: andi.id, groupId: contentGroup.id, role: "member" },
      { userId: rizki.id, groupId: morningGroup.id, role: "member" },
    ],
  });

  // ──── Join Requests ────
  console.log("Creating join requests...");

  await prisma.groupJoinRequest.createMany({
    data: [
      // Pending requests (for demo waitlist)
      {
        groupId: techGroup.id,
        userId: rina.id,
        status: "pending",
        message:
          "Halo! Saya Creative Director tapi lagi belajar coding untuk improve kolaborasi sama developer. Boleh join komunitas ini?",
      },
      {
        groupId: techGroup.id,
        userId: mega.id,
        status: "pending",
        message:
          "Saya content creator tapi mau belajar tentang tech industry lebih dalam. Tertarik untuk networking juga.",
      },
      {
        groupId: startupGroup.id,
        userId: andi.id,
        status: "pending",
        message:
          "Saya lagi bikin side project dan butuh insight dari founder. Boleh join untuk networking?",
      },
      // Approved request
      {
        groupId: bandungTech.id,
        userId: rizki.id,
        status: "approved",
        message: "Saya data scientist yang sering ke Bandung, mau join komunitas tech di sana.",
        reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      // Rejected request
      {
        groupId: designGroup.id,
        userId: dika.id,
        status: "rejected",
        message: "Mau belajar design untuk improve portfolio sebagai developer.",
        rejectionReason: "Saat ini grup sedang penuh. Silakan coba lagi bulan depan ya!",
        reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
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
      {
        userId: mega.id,
        plan: "pro",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: thirtyDaysLater,
      },
    ],
  });

  console.log("\n✅ Seeding completed!");
  console.log("\nTest accounts (password: password123):");
  console.log("  andi@example.com  → FREE  (member di beberapa grup)");
  console.log("  sari@example.com  → PRO   (admin: Ngoding Bareng + Deep Work)");
  console.log("  budi@example.com  → PRO   (admin: Startup Founders + Ngopi)");
  console.log("  rina@example.com  → TEAM  (admin: Design Jam + Bandung Tech)");
  console.log("  mega@example.com  → PRO   (admin: Content Creators + Morning)");
  console.log("  dika@example.com  → FREE  (member)");
  console.log("  rizki@example.com → FREE  (member)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
