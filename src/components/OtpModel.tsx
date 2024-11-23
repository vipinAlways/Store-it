"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";
import { Button } from "./ui/button";
import { sendEmailOtp, verifySecret } from "@/lib/action/user.action";
import { useRouter } from "next/navigation";

const OtpModel = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const accId = accountId
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (accId === undefined) {
        throw new Error('account ai hi nahi aa rahi ')
      }
      const sessionId = await verifySecret({ accountId:accId, password:password });
      ;
      if (sessionId) {
        router.push("/");
      }
    } catch (error) {
     throw new Error(`${error}`)
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    await sendEmailOtp({ email: email });
  };
  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="shad-alert-dialong flex items-center flex-col">
          <AlertDialogHeader className="relative flex justify-center w-full">
            <AlertDialogTitle className="h2 text-center">
              Enter Your otp{" "}
              <Image
                src="/assets/icons/close-dark.svg"
                alt="close"
                width={20}
                height={20}
                onClick={() => setIsOpen(false)}
                className="otp-close-button"
              />
            </AlertDialogTitle>
            <AlertDialogDescription className="sutitle-2 text-center">
              we&#39;ve sent a code to{" "}
              <span className="pl-1 text-brand">{email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <InputOTP maxLength={6} value={password} onChange={setPassword}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>

          <AlertDialogFooter>
            <div className="flex w-full flex-col gap-4">
              <AlertDialogAction
                className="shad-submit-btn h-12"
                type="submit"
                onClick={handleSubmit}
              >
                Continue{" "}
                {isLoading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </AlertDialogAction>

              <div className="subtitle-2 mt-2 text-light-100">
                Didn&#39;t get a code
                <Button
                  type="button"
                  variant="link"
                  className="pl-1 text-brand"
                  onClick={handleResendOtp}
                >
                  Click to resend the code
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OtpModel;
