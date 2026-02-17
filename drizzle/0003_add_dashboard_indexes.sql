-- Add indexes for dashboard query performance
-- These indexes optimize the date range queries used in the dashboard

-- Index on introduction_requests.created_at for date range filtering
CREATE INDEX IF NOT EXISTS "introduction_requests_created_at_idx" ON "introduction_requests" ("created_at");

-- Index on introduction_requests.updated_at for response time calculations
CREATE INDEX IF NOT EXISTS "introduction_requests_updated_at_idx" ON "introduction_requests" ("updated_at");

-- Composite index for requester queries with date filtering
CREATE INDEX IF NOT EXISTS "introduction_requests_requester_created_idx" ON "introduction_requests" ("requester_id", "created_at", "deleted");

-- Composite index for approver queries with date filtering
CREATE INDEX IF NOT EXISTS "introduction_requests_approver_created_idx" ON "introduction_requests" ("approver_id", "created_at", "deleted");

-- Composite index for status filtering with date range
CREATE INDEX IF NOT EXISTS "introduction_requests_status_created_idx" ON "introduction_requests" ("status", "created_at", "deleted");

-- Index on contacts.created_at for date range filtering
CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "contacts" ("created_at");

-- Composite index for user's contacts with date filtering
CREATE INDEX IF NOT EXISTS "contacts_user_created_idx" ON "contacts" ("user_id", "created_at");

-- Made with Bob
