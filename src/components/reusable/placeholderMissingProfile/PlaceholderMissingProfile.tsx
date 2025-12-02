import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  useUserDetails,
  type ProfileSetupSessionState,
} from "../../../context/UserDetails";
import { LoadingPlaceholder } from "../loadingPlaceholder/LoadingPlaceholder";
import { Button } from "../../ui/button";
import { Target, Wallet, TrendingUp, PiggyBank } from "lucide-react";

export function PlaceholderMissingProfile() {
  const router = useRouter();
  const { startProfileSetupSession } = useUserDetails();
  const [isStarting, setIsStarting] = useState(false);
  const [resumeSessions, setResumeSessions] = useState<
    ProfileSetupSessionState[] | null
  >(null);
  const [modalBusy, setModalBusy] = useState(false);

  const handleGetStarted = async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      const session = await startProfileSetupSession();
      if (session.resumed) {
        setResumeSessions([session]);
        setIsStarting(false);
        return;
      }

      router.navigate({
        to: "/auth/profile-setup/$token",
        params: { token: session.token },
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleResumeSession = (session: ProfileSetupSessionState) => {
    setResumeSessions(null);
    router.navigate({
      to: "/auth/profile-setup/$token",
      params: { token: session.token },
    });
  };

  const handleStartFresh = async () => {
    if (modalBusy) return;
    setModalBusy(true);
    try {
      const session = await startProfileSetupSession({ forceNew: true });
      setResumeSessions(null);
      router.navigate({
        to: "/auth/profile-setup/$token",
        params: { token: session.token },
      });
    } finally {
      setModalBusy(false);
    }
  };

  const handleCloseModal = () => {
    if (modalBusy) return;
    setResumeSessions(null);
  };

  return (
    <>
      <LoadingPlaceholder
        icon={TrendingUp}
        title="Welcome to Finovora"
        description="Let's set up your profile to personalize your financial journey and help you achieve your goals."
        buttonText="Get Started"
        buttonSubtext="Takes only 2 minutes"
        onAction={handleGetStarted}
        isActionLoading={isStarting}
        floatingIcons={[
          {
            icon: PiggyBank,
            position: "top-left",
            className: "text-accent/40",
            animationDelay: 0,
          },
          {
            icon: Wallet,
            position: "bottom-right",
            className: "text-primary/40",
            animationDelay: 0.5,
          },
          {
            icon: Target,
            position: "top-right",
            className: "text-accent/30",
            animationDelay: 1,
          },
        ]}
      />
      {resumeSessions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Resume profile setup</h3>
              <p className="text-sm text-muted-foreground">
                Pick an existing session or start a fresh one.
              </p>
            </div>
            <div className="space-y-3">
              {resumeSessions?.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl border border-border/70 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      Session #{session.id} - {session.status.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {new Date(session.expiresAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleResumeSession(session)}
                    disabled={modalBusy}
                  >
                    Resume
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={modalBusy}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleStartFresh}
                disabled={modalBusy}
              >
                Start new session
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
