ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "clerkId" varchar(64);
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkId_unique" ON "User" ("clerkId");
