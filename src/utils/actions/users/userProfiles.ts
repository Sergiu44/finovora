import { createEnhancedAxios } from "../../../configs/axios";

export interface UserProfileDTO {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    dateOfBirth?: string | null;
    statusMessage?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    preferredStartDayOfMonth: number;
    themePreference: "light" | "dark" | "system";
    preferredCurrency?: string | null;
}

export interface UpdateUserProfilePayload {
    firstName?: string;
    lastName?: string;
    username?: string;
    dateOfBirth?: string;
    statusMessage?: string;
    bio?: string;
    preferredStartDayOfMonth?: number;
    themePreference?: "light" | "dark" | "system";
    preferredCurrency?: string;
}

export async function getUserProfile(): Promise<UserProfileDTO> {
    const res = await createEnhancedAxios().get(`${import.meta.env.VITE_API_URL}/user/profile`);
    return res.data as UserProfileDTO;
}

export async function updateUserProfile(payload: UpdateUserProfilePayload): Promise<UserProfileDTO> {
    const res = await createEnhancedAxios().put(
        `${import.meta.env.VITE_API_URL}/user/profile`,
        payload
    );
    return res.data.profile as UserProfileDTO;
}