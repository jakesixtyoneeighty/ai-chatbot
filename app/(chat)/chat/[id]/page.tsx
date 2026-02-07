import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { resolveChatModelId } from "@/lib/ai/models";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { convertToUIMessages } from "@/lib/utils";

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <ChatPage params={props.params} />
    </Suspense>
  );
}

async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chat = await getChatById({ id });

  if (!chat) {
    redirect("/");
  }

  const user = await getAuthUser();

  if (!user) {
    const signInUrl =
      process.env.CLERK_SIGN_IN_URL ??
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ??
      "/sign-in";
    redirect(signInUrl);
  }

  if (chat.visibility === "private") {
    if (user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  const uiMessages = convertToUIMessages(messagesFromDb);

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");
  const resolvedModelId = resolveChatModelId(chatModelFromCookie?.value);

  return (
    <>
      <Chat
        autoResume={true}
        id={chat.id}
        initialChatModel={resolvedModelId}
        initialMessages={uiMessages}
        initialVisibilityType={chat.visibility}
        isReadonly={user.id !== chat.userId}
      />
      <DataStreamHandler />
    </>
  );
}
