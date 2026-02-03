-- Add user profile fields to User table
ALTER TABLE "User" ADD COLUMN "name" varchar(100);
ALTER TABLE "User" ADD COLUMN "sex" varchar(32);
ALTER TABLE "User" ADD COLUMN "age" varchar(10);
ALTER TABLE "User" ADD COLUMN "location" varchar(200);
ALTER TABLE "User" ADD COLUMN "nudismExperience" varchar(64);
ALTER TABLE "User" ADD COLUMN "bio" text;
