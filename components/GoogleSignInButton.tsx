"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

const GoogleSignInButton = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Button
      className="w-full"
      variant={"outline"}
      onClick={() =>
        signIn("google", {
          callbackUrl: callbackUrl || "/dashboard/switch-store",
        })
      }
    >
      Continue with Google
    </Button>
  );
};

export default GoogleSignInButton;
