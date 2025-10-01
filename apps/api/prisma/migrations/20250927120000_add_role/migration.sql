-- Create Role enum type and add role column to User with default 'user'
-- This migration is written for PostgreSQL.

CREATE TYPE "Role" AS ENUM ('user','admin');

ALTER TABLE "User"
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'user';

-- If you later need to remove the enum and column, follow a safe rollback path:
-- 1) ALTER TABLE "User" DROP COLUMN "role";
-- 2) DROP TYPE "Role";
