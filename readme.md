# Work Circle

Platform komunitas untuk menemukan coworking space, membentuk grup kerja, dan terhubung dengan sesama remote worker.

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 19, TanStack Router, TanStack Query, Tailwind CSS v4, Vite |
| **Backend** | Hono, TypeScript, Prisma ORM, Zod v4, jose (JWT), bcryptjs |
| **Database** | PostgreSQL (Neon) |
| **Storage** | Cloudflare R2 (avatar & cover upload) |
| **Email** | Resend |
| **Monorepo** | pnpm + Turborepo |

## Struktur Project

```
work-circle/
├── apps/
│   ├── api/              # Hono REST API (port 3001)
│   │   ├── prisma/       # Schema & migrations
│   │   └── src/
│   │       ├── modules/  # Domain modules
│   │       │   ├── admin/
│   │       │   ├── auth/
│   │       │   ├── groups/
│   │       │   ├── notifications/
│   │       │   ├── spaces/
│   │       │   ├── subscriptions/
│   │       │   └── upload/
│   │       └── middleware/
│   └── platform/         # React SPA
│       └── src/
│           ├── components/
│           ├── hooks/
│           ├── lib/
│           └── routes/
├── docs/                 # Pattern docs & implementation plan
├── turbo.json
└── pnpm-workspace.yaml
```

## Fitur

- **Auth** — Register, login, email verification, password reset (JWT httpOnly cookie)
- **Groups** — Buat & kelola grup kerja, join request dengan approval, admin panel
- **Spaces** — Direktori coworking space dengan detail (wifi, noise level, power, harga)
- **Map** — Peta interaktif berbasis Leaflet dengan marker clustering & glass popup
- **Discover** — Cari grup dengan full-text search, infinite scroll, filter kategori
- **Onboarding** — 2-step interest picker untuk user baru
- **Notifications** — Bell notification dengan polling, unread badge
- **Upload** — Avatar & cover image upload via presigned URL ke Cloudflare R2
- **Subscriptions** — Sistem plan (free/pro/team) dengan integrasi Mayar
- **Admin Panel** — Dashboard admin (stats, kelola users, spaces, groups)

## Demo Accounts

Jalankan `pnpm db:seed` untuk membuat data demo. Semua akun menggunakan password: **`password123`**

| Email | Plan | Role | Deskripsi |
|-------|------|------|-----------|
| `andi@example.com` | Free | Member | Member di 3 grup, punya beberapa pending join request. Perspektif user baru yang explore & join grup. |
| `sari@example.com` | Pro | Admin | Admin 3 grup (Ngoding Bareng, Deep Work, Remote Worker). Ada pending join request masuk untuk di-approve/reject. |
| `budi@example.com` | Pro | Admin | Admin 3 grup (Startup Founders, Ngopi, Content Creator). Ada pending join request masuk. |
| `rina@example.com` | Team | Admin | Admin 2 grup (Design Jam, Growth & Marketing). Juga punya pending request ke grup lain. |

### Skenario Demo

- **Join flow** — Login sebagai `andi`, buka Discover, cari grup dan kirim join request
- **Admin approval** — Login sebagai `sari` atau `budi`, buka grup yang di-admin, lihat tab Waitlist, approve/reject request
- **Create group** — Login sebagai user Pro/Team, buat grup baru dan pilih space
- **Explore spaces** — Buka halaman Spaces untuk lihat map interaktif dan daftar coworking space

## Prasyarat

- Node.js >= 18
- pnpm >= 10
- PostgreSQL (atau akun [Neon](https://neon.tech))

## Setup

1. **Clone & install dependencies**

   ```bash
   git clone <repo-url> work-circle
   cd work-circle
   pnpm install
   ```

2. **Environment variables**

   Buat file `.env` di root project:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

   # Auth
   JWT_SECRET="your-secret-key"
   JWT_EXPIRES_IN="7d"

   # URLs
   APP_URL="http://localhost:3001"
   FRONTEND_URL="http://localhost:5173"
   API_PORT=3001

   # Cloudflare R2 (upload)
   R2_ACCOUNT_ID=""
   R2_ACCESS_KEY_ID=""
   R2_SECRET_ACCESS_KEY=""
   R2_BUCKET=""
   R2_PUBLIC_URL=""

   # Email (Resend)
   RESEND_API_KEY=""
   EMAIL_FROM="noreply@yourdomain.com"

   # Payment (Mayar)
   MAYAR_API_KEY=""
   MAYAR_WEBHOOK_SECRET=""

   # Map
   VITE_MAPBOX_TOKEN=""
   ```

3. **Setup database**

   ```bash
   pnpm db:generate    # Generate Prisma client
   pnpm db:migrate     # Run migrations
   pnpm db:seed        # Seed data (optional)
   ```

4. **Jalankan development server**

   ```bash
   pnpm dev            # Jalankan API + frontend sekaligus
   pnpm dev:api        # API saja (http://localhost:3001)
   pnpm dev:web        # Frontend saja (http://localhost:5173)
   ```

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `pnpm dev` | Jalankan semua apps (API + frontend) |
| `pnpm dev:api` | Jalankan API saja |
| `pnpm dev:web` | Jalankan frontend saja |
| `pnpm build` | Build semua apps |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Jalankan database migration |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Buka Prisma Studio |

## API Endpoints

Semua endpoint menggunakan prefix `/api`. Response menggunakan envelope format `{ data, meta? }`.

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/groups` | List groups (FTS, infinite scroll) |
| POST | `/api/groups` | Create group |
| GET | `/api/groups/:id` | Group detail |
| GET | `/api/spaces` | List spaces |
| GET | `/api/spaces/:id` | Space detail |
| GET | `/api/notifications` | List notifications |
| POST | `/api/upload/presign` | Get presigned upload URL |
| GET | `/api/subscriptions/*` | Subscription endpoints |
| GET | `/api/admin/*` | Admin endpoints (requires isAdmin) |
