import { cookies } from "next/headers";
import { Suspense } from "react";
import { AuthOverlay } from "@/components/auth-overlay";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { resolveChatModelId } from "@/lib/ai/models";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { generateUUID } from "@/lib/utils";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <NewChatPage />
    </Suspense>
  );
}

async function NewChatPage() {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("chat-model");
  const resolvedModelId = resolveChatModelId(modelIdFromCookie?.value);
  const id = generateUUID();
  const user = await getAuthUser();
  const isReadonly = !user;

  return (
    <>
      <Chat
        autoResume={false}
        id={id}
        initialChatModel={resolvedModelId}
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={isReadonly}
        key={id}
      />
      <DataStreamHandler />
      <AuthOverlay />
    </>
  );
}
