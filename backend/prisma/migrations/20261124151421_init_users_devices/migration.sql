-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('controller', 'remote');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'locked');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" CHAR(10) NOT NULL,
    "password_hash" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'remote',
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" VARCHAR(20) NOT NULL,
    "device_uuid" VARCHAR(64) NOT NULL,
    "user_id" VARCHAR(20),
    "device_type" SMALLINT NOT NULL,
    "device_name" VARCHAR(50) NOT NULL,
    "camera_name" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_uuid_key" ON "devices"("device_uuid");

-- CreateIndex
CREATE INDEX "devices_user_id_idx" ON "devices"("user_id");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Check constraints
ALTER TABLE "users" ADD CONSTRAINT "users_phone_format" CHECK ("phone" ~ '^0[0-9]{9}$');
ALTER TABLE "devices" ADD CONSTRAINT "devices_type_valid" CHECK ("device_type" IN (1, 2, 4));
