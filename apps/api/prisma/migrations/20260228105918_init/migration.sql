-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('free', 'pro', 'team');

-- CreateEnum
CREATE TYPE "GroupCategory" AS ENUM ('tech', 'creative', 'business', 'productivity', 'casual');

-- CreateEnum
CREATE TYPE "GroupMemberRole" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'past_due', 'expired');

-- CreateEnum
CREATE TYPE "WifiSpeed" AS ENUM ('slow', 'medium', 'fast', 'very_fast');

-- CreateEnum
CREATE TYPE "NoiseLevel" AS ENUM ('quiet', 'medium', 'buzzy', 'loud');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('whatsapp', 'telegram', 'discord');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT,
    "google_id" TEXT,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "job_title" TEXT,
    "company" TEXT,
    "location" TEXT,
    "profile_complete" BOOLEAN NOT NULL DEFAULT false,
    "plan" "UserPlan" NOT NULL DEFAULT 'free',
    "plan_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "GroupCategory" NOT NULL,
    "admin_id" UUID NOT NULL,
    "space_id" UUID,
    "schedule" TEXT NOT NULL,
    "time_start" TEXT NOT NULL,
    "time_end" TEXT NOT NULL,
    "max_members" INTEGER NOT NULL DEFAULT 8,
    "vibe" TEXT,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "color" TEXT NOT NULL DEFAULT '#635BFF',
    "require_approval" BOOLEAN NOT NULL DEFAULT true,
    "chat_link" TEXT,
    "chat_type" "ChatType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "role" "GroupMemberRole" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_join_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "group_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "rejection_reason" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "wifi_speed" "WifiSpeed" NOT NULL DEFAULT 'medium',
    "noise_level" "NoiseLevel" NOT NULL DEFAULT 'medium',
    "has_power" BOOLEAN NOT NULL DEFAULT true,
    "price_range" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "seat_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan" "UserPlan" NOT NULL,
    "mayar_subscription_id" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_google_id_idx" ON "users"("google_id");

-- CreateIndex
CREATE INDEX "users_plan_idx" ON "users"("plan");

-- CreateIndex
CREATE INDEX "groups_admin_id_idx" ON "groups"("admin_id");

-- CreateIndex
CREATE INDEX "groups_space_id_idx" ON "groups"("space_id");

-- CreateIndex
CREATE INDEX "groups_category_idx" ON "groups"("category");

-- CreateIndex
CREATE INDEX "groups_is_open_idx" ON "groups"("is_open");

-- CreateIndex
CREATE INDEX "groups_created_at_idx" ON "groups"("created_at");

-- CreateIndex
CREATE INDEX "group_members_user_id_idx" ON "group_members"("user_id");

-- CreateIndex
CREATE INDEX "group_members_group_id_idx" ON "group_members"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_user_id_group_id_key" ON "group_members"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "group_join_requests_group_id_status_idx" ON "group_join_requests"("group_id", "status");

-- CreateIndex
CREATE INDEX "group_join_requests_user_id_idx" ON "group_join_requests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_join_requests_user_id_group_id_key" ON "group_join_requests"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "spaces_area_idx" ON "spaces"("area");

-- CreateIndex
CREATE INDEX "spaces_rating_idx" ON "spaces"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_join_requests" ADD CONSTRAINT "group_join_requests_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_join_requests" ADD CONSTRAINT "group_join_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
