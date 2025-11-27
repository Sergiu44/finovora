import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useUserDetails } from "../../../context/UserDetails";
import { ProfileSettingsView } from "../../dashboard/settings/profile/index";

export const Route = createFileRoute("/auth/profile-setup/$token")({
  component: ProfileSetupGate,
});

function ProfileSetupGate() {
  const { token } = Route.useParams();
  const { validateProfileSetupSession } = useUserDetails();
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateProfileSetupSession(token)
      .then(() => setIsValid(true))
      .catch(() =>
        setError("This profile setup session is invalid or has expired.")
      );
  }, [token, validateProfileSetupSession]);

  if (error) {
    window.location.href = "/auth/login";
    return null;
  }

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>Validating your secure session…</p>
      </div>
    );
  }

  return <ProfileSettingsView />;
}

