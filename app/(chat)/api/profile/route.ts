import { getAuthUser } from "@/lib/auth/get-auth-user";
import { getUserProfile, updateUserProfile } from "@/lib/db/queries";
import type { UserProfile } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const profile = await getUserProfile({ userId: authUser.id });

    return Response.json(profile ?? {}, { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Error fetching user profile:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const body = await request.json();
    
    // Validate and sanitize the profile data
    const profile: UserProfile = {
      name: typeof body.name === "string" ? body.name.slice(0, 100) : null,
      sex: typeof body.sex === "string" ? body.sex.slice(0, 32) : null,
      age: typeof body.age === "string" ? body.age.slice(0, 10) : null,
      location: typeof body.location === "string" ? body.location.slice(0, 200) : null,
      nudismExperience: typeof body.nudismExperience === "string" ? body.nudismExperience.slice(0, 64) : null,
      bio: typeof body.bio === "string" ? body.bio.slice(0, 500) : null,
    };

    const updatedUser = await updateUserProfile({
      userId: authUser.id,
      profile,
    });

    return Response.json({ success: true, profile: updatedUser }, { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }
    console.error("Error updating user profile:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}
