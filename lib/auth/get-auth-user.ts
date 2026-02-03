import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  createUserFromClerk,
  getUser,
  getUserByClerkId,
  updateUserClerkId,
} from "@/lib/db/queries";
import type { AuthUser } from "@/lib/auth/types";

type ClerkUser = {
  id: string;
  username?: string | null;
  primaryEmailAddressId?: string | null;
  emailAddresses: { id: string; emailAddress: string }[];
};

function getClerkEmail(clerkUser: ClerkUser) {
  const primaryEmail = clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  return (
    primaryEmail ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    clerkUser.username ??
    clerkUser.id
  );
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const userByClerkId = await getUserByClerkId(userId);

  if (userByClerkId) {
    return {
      id: userByClerkId.id,
      email: userByClerkId.email,
      clerkId: userByClerkId.clerkId,
    };
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);
  const email = getClerkEmail(clerkUser);

  const usersByEmail = await getUser(email);
  const existingUser = usersByEmail.at(0);

  if (existingUser) {
    const updatedUser = await updateUserClerkId({
      userId: existingUser.id,
      clerkId: userId,
    });

    const resolvedUser = updatedUser ?? { ...existingUser, clerkId: userId };

    return {
      id: resolvedUser.id,
      email: resolvedUser.email,
      clerkId: resolvedUser.clerkId,
    };
  }

  const [createdUser] = await createUserFromClerk({
    clerkId: userId,
    email,
  });

  return createdUser
    ? {
        id: createdUser.id,
        email: createdUser.email,
        clerkId: createdUser.clerkId,
      }
    : null;
}
