import React from "react";
import Link from "next/link";
import EmailVerificationForm from "@/components/auth/email-verification-form";
import { Icons } from "@/components/icons";

const EmailVerification = () => {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Auth</h1>
          <p className="text-sm text-muted-foreground">
            Confirming your verification
          </p>
        </div>
        <EmailVerificationForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="hover:text-brand underline underline-offset-4"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
