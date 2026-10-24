-- PostgreSQL Exclusion Constraint & Concurrency Migration
-- File: packages/database/prisma/migrations/001_reservation_allocations_exclusion_constraint.sql

-- Enable btree_gist extension for combining UUID equality with tstzrange overlapping check
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Add occupancy_range column if not exists
ALTER TABLE "reservation_allocations" 
ADD COLUMN IF NOT EXISTS "occupancy_range" tstzrange;

-- Populate occupancy_range from starts_at and ends_at
UPDATE "reservation_allocations"
SET "occupancy_range" = tstzrange("starts_at", "ends_at", '[)')
WHERE "occupancy_range" IS NULL;

-- Hard exclusion constraint: Zero overlapping confirmed exclusive allocations
ALTER TABLE "reservation_allocations"
DROP CONSTRAINT IF EXISTS "no_overlapping_confirmed_allocations";

ALTER TABLE "reservation_allocations"
ADD CONSTRAINT "no_overlapping_confirmed_allocations"
EXCLUDE USING gist (
  "resource_id" WITH =,
  "occupancy_range" WITH &&
)
WHERE ("status" = 'CONFIRMED');

-- Fast index for range overlap checks
CREATE INDEX IF NOT EXISTS "idx_allocations_resource_occupancy" 
ON "reservation_allocations" USING gist ("resource_id", "occupancy_range");
