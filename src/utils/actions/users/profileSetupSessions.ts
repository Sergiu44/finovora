import { createEnhancedAxios } from "../../../configs/axios";

export type ProfileSetupSessionStatus = "active" | "completed" | "expired";

export interface ProfileSetupSessionState {
  id: number;
  userId: number;
  token: string;
  status: ProfileSetupSessionStatus;
  expiresAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  path: string;
  url: string;
  resumed: boolean;
}

export interface UserProfile {
  id: number;
  userId: number;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  dateOfBirth?: string | null;
  statusMessage?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  preferredStartDayOfMonth: number;
  themePreference: "light" | "dark" | "system";
  language: string;
  timezone?: string | null;
  preferredCurrency?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface SetupUserProfilePayload {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  dateOfBirth: string;
  statusMessage?: string;
  avatarUrl?: string;
  preferredStartDayOfMonth: number;
  themePreference: "light" | "dark" | "system";
  preferredCurrencyId: string;
}

function mapSessionResponse(data: any, resumed: boolean): ProfileSetupSessionState {
  const { session, path, url } = data;
  return {
    ...session,
    expiresAt: session.expiresAt,
    completedAt: session.completedAt,
    path,
    url,
    resumed,
  };
}

export async function startProfileSetupSession(
  options?: { forceNew?: boolean }
): Promise<ProfileSetupSessionState> {
  const response = await createEnhancedAxios().post(
    `${import.meta.env.VITE_API_URL}/profile-setup-sessions`,
    options ?? {}
  );

  return mapSessionResponse(response.data, response.data.resumed);
}

export async function validateProfileSetupSession(
  token: string
): Promise<ProfileSetupSessionState> {
  const response = await createEnhancedAxios().get(
    `${import.meta.env.VITE_API_URL}/profile-setup-sessions/${token}`
  );
  return mapSessionResponse(response.data, false);
}

export async function completeProfileSetupSession(token: string): Promise<void> {
  await createEnhancedAxios().post(
    `${import.meta.env.VITE_API_URL}/profile-setup-sessions/${token}/complete`
  );
}

export async function setupUserProfile(
  token: string,
  profileData: SetupUserProfilePayload
): Promise<{message: string, profile: UserProfile}> {
  const formData = new FormData();
  
  // Append all text fields
  formData.append("username", profileData.username);
  formData.append("firstName", profileData.firstName);
  formData.append("lastName", profileData.lastName);
  formData.append("bio", profileData.bio);
  formData.append("dateOfBirth", profileData.dateOfBirth);
  formData.append("preferredStartDayOfMonth", profileData.preferredStartDayOfMonth.toString());
  formData.append("themePreference", profileData.themePreference);
  formData.append("preferredCurrencyId", profileData.preferredCurrencyId);
  
  // Append optional fields if they exist
  if (profileData.statusMessage) {
    formData.append("statusMessage", profileData.statusMessage);
  }
  
  // TO BE DONE: Handle avatar upload to cloud storage
  // The avatarUrl is currently a local data URL/ObjectURL that needs to be:
  // 1. Converted to a File/Blob
  // 2. Sent to backend
  // 3. Uploaded to cloud storage (S3, Cloudinary, etc.)
  // 4. Store the cloud URL in the database
  // if (profileData.avatarUrl) {
  //   if (profileData.avatarUrl.startsWith("data:")) {
  //     // Convert data URL to blob
  //     const response = await fetch(profileData.avatarUrl);
  //     const blob = await response.blob();
  //     formData.append("avatar", blob, "avatar.jpg");
  //   } else {
  //     // If it's already a URL string, append as is
  //     formData.append("avatarUrl", profileData.avatarUrl);
  //   }
  // }
  
  const response = await createEnhancedAxios().post(
    `${import.meta.env.VITE_API_URL}/profile-setup-sessions/${token}/setup`,
    formData
  );
  return response.data;
}

