import type { User } from "@/lib/db/schema";

export type AuthUser = Pick<User, "id" | "email" | "clerkId">;
