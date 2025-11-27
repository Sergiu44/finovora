import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import {
  Target,
  ArrowRight,
  Wallet,
  TrendingUp,
  PiggyBank,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  useUserDetails,
  type ProfileSetupSessionState,
} from "../../../context/UserDetails";

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
      <div className="relative flex flex-col items-center justify-center min-h-[70vh] p-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="relative"
        >
          {/* Animated rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 200, height: 200, left: -50, top: -50 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{ width: 200, height: 200, left: -50, top: -50 }}
          />
          
          {/* Main icon container */}
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/30"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <TrendingUp className="w-12 h-12 text-primary-foreground" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center max-w-md"
        >
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Welcome to Finovora
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Let's set up your profile to personalize your financial journey and help you achieve your goals.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            onClick={handleGetStarted}
            size="lg"
            disabled={isStarting}
            className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <span>Get Started</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Takes only 2 minutes
          </p>
        </motion.div>

        {/* Floating finance-themed decorative elements */}
        <motion.div
          className="absolute top-20 left-20 text-accent/40"
          animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PiggyBank className="w-6 h-6" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-32 text-primary/40"
          animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Wallet className="w-5 h-5" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-40 text-accent/30"
          animate={{ y: [0, -25, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Target className="w-7 h-7" />
        </motion.div>
      </div>
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
