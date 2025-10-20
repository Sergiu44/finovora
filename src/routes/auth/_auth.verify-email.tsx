import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import InputCode from "../../components/reusable/inputs/InputCode";
import { createEnhancedAxios } from "../../configs/axios";
import { Button } from "../../components/ui/button";
import type { AuthVerificationCode } from "../../types/auth/AuthTypes";

export const Route = createFileRoute("/auth/_auth/verify-email")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || "",
    };
  },
});

function RouteComponent() {
  const router = useRouter();
  const { email } = useSearch({
    from: "/auth/_auth/verify-email",
  });

  const [verificationCode, setVerificationCode] =
    useState<AuthVerificationCode | null>(null);

  // Countdown until verification code expiration (in seconds)
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // Start countdown when component mounts
    if (verificationCode?.verificationCode?.verificationCode.expiresAt) {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }

      const expiresAtIso = verificationCode.verificationCode.verificationCode
        .expiresAt as Date;
      const expiresAtMs = new Date(expiresAtIso).getTime();
      const nowMs = Date.now();
      const initialSeconds = Math.max(
        0,
        Math.floor((expiresAtMs - nowMs) / 1000)
      );
      setRemainingSeconds(initialSeconds);

      if (initialSeconds > 0) {
        timer.current = window.setInterval(() => {
          setRemainingSeconds((prev) => {
            const next = Math.max(0, prev - 1);
            if (next === 0 && timer.current) {
              clearInterval(timer.current);
              timer.current = null;
            }
            return next;
          });
        }, 1000);
      }
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [verificationCode]);

  const handleResendCode = () => {
    createEnhancedAxios()
      .post(`${import.meta.env.VITE_API_URL}/auth/email/send`, {
        email: email,
      })
      .then((response) => {
        const newVerificationCode = response.data;
        setVerificationCode({
          verified: false,
          verificationCode: newVerificationCode,
        });

        // Update URL with new verification code
        router.navigate({
          to: "/auth/verify-email",
          search: {
            email: email,
          },
        });
      });
  };

  const handleVerificationComplete = (code: string) => {
    createEnhancedAxios()
      .get(`${import.meta.env.VITE_API_URL}/auth/email/verify/${code}`)
      .then(() => {
        router.navigate({ to: "/auth/login" });
      });
  };

  return (
    <div className="mx-auto flex flex-col">
      <div className="mt-10">
        <h3 className="text-center text-3xl text-foreground">
          We emailed you a code!
        </h3>
        <p className="text-center text-foreground mt-2">
          Enter the verification code we sent to:{" "}
          <span className="font-bold">{email}</span>
        </p>
        <InputCode
          className="items-center! my-8"
          onComplete={handleVerificationComplete}
          loading={false}
        />

        <div className="flex items-center flex-col">
          <p className="text-muted-foreground">Didn't receive the code?</p>
          <Button
            type="button"
            onClick={handleResendCode}
            className="mt-1"
            disabled={remainingSeconds > 0}
            title={
              remainingSeconds > 0
                ? "Please wait until the timer ends"
                : undefined
            }
          >
            {remainingSeconds > 0
              ? `Resend in ${Math.floor(remainingSeconds / 60)}:${
                  remainingSeconds % 60 < 10 ? "0" : ""
                }${remainingSeconds % 60}`
              : "Resend code"}
          </Button>
        </div>

        <div className="text-center mt-8">
          <p className="text-3xl text-foreground">
            {Math.floor(remainingSeconds / 60)}:
            {remainingSeconds % 60 < 10 ? "0" : ""}
            {remainingSeconds % 60}
          </p>
        </div>
      </div>
    </div>
  );
}
