ALTER TABLE "User" ADD COLUMN "bannedAt" timestamp;
ALTER TABLE "User" ADD COLUMN "banReason" text;

CREATE TABLE "BannedIp" (
  "ip" varchar(64) PRIMARY KEY NOT NULL,
  "reason" text,
  "createdAt" timestamp NOT NULL
);
