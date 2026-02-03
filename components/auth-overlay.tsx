"use client";

import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthOverlay() {
  const signInUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";
  const signUpUrl =
    process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";

  return (
    <SignedOut>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-background p-6 text-center shadow-lg">
          <h2 className="font-semibold text-xl text-foreground">
            Sign in to start chatting
          </h2>
          <p className="text-muted-foreground text-sm">
            Create an account or sign in to access the full chat experience.
          </p>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <SignInButton mode="redirect">
              <Button className="w-full">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="redirect">
              <Button className="w-full" variant="secondary">
                Sign up
              </Button>
            </SignUpButton>
          </div>
          <a
            className="text-muted-foreground text-xs underline-offset-4 hover:underline"
            href={signInUrl}
          >
            Go to the sign-in page
          </a>
          <a
            className="text-muted-foreground text-xs underline-offset-4 hover:underline"
            href={signUpUrl}
          >
            Go to the sign-up page
          </a>
        </div>
      </div>
    </SignedOut>
  );
}
