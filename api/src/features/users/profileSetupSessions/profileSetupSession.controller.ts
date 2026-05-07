import { Request, Response } from "express";
import {
  BAD_REQUEST,
  CREATED,
  NOT_FOUND,
  OK,
} from "../../../utils/constants/http";
import appAssert from "../../../utils/utilities/appAssert";
import catchErrors from "../../../utils/utilities/catchErrors";
import { CreateOrResumeProfileSetupSessionSchema } from "./profileSetupSession.schemas";
import {
  PROFILE_SETUP_SESSION_TTL_MINUTES,
  buildSessionPath,
  buildSessionUrl,
  serializeSession,
  findActiveSessionForUser,
  findSessionForUserOrThrow,
  createProfileSetupSession,
  expireSession,
  completeSession,
} from "./profileSetupSession.service";
import User from "../user";
import { UserProfile } from "../userProfiles/userProfile";
import { Account } from "../../accounts/account";
import { AccountType } from "../../accounts/accountTypes/accountType";
import { Currency } from "../../currencies/currency";

export const createOrResumeProfileSetupSessionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { forceNew } = req.body as CreateOrResumeProfileSetupSessionSchema;

    const existingSession = await findActiveSessionForUser(userId);

    if (existingSession && !forceNew) {
      return res.status(OK).json({
        resumed: true,
        session: serializeSession(existingSession),
        path: buildSessionPath(existingSession.token),
        url: buildSessionUrl(existingSession.token),
        expiresInMinutes: PROFILE_SETUP_SESSION_TTL_MINUTES,
      });
    }

    if (existingSession && forceNew) {
      await expireSession(existingSession);
    }

    const session = await createProfileSetupSession(userId);

    return res.status(CREATED).json({
      resumed: false,
      session: serializeSession(session),
      path: buildSessionPath(session.token),
      url: buildSessionUrl(session.token),
      expiresInMinutes: PROFILE_SETUP_SESSION_TTL_MINUTES,
    });
  }
);

export const getProfileSetupSessionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { token } = req.params;

    const session = await findSessionForUserOrThrow(token, userId);

    return res.status(OK).json({
      session: serializeSession(session),
      path: buildSessionPath(session.token),
      url: buildSessionUrl(session.token),
    });
  }
);

export const completeProfileSetupSessionHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { token } = req.params;

    const session = await findSessionForUserOrThrow(token, userId);

    appAssert(
      session.status === "active",
      BAD_REQUEST,
      "Session already closed"
    );

    const user = await User.findByPk(userId);
    appAssert(user, NOT_FOUND, "User not found");

    // Multer parses form data into req.body and req.files
    // Handle file upload if present (for future avatar upload)
    const files = (req.files as Express.Multer.File[]) || [];
    const avatarFile = files.find((file) => file.fieldname === "avatar");

    // Form data fields come as strings, so we need to parse them
    const {
      firstName,
      lastName,
      username,
      dateOfBirth,
      statusMessage,
      bio,
      avatarUrl,
      preferredStartDayOfMonth,
      themePreference,
      preferredCurrencyId,
    } = req.body || {};

    // Parse numeric field - form data sends numbers as strings
    const preferredStartDay = preferredStartDayOfMonth
      ? parseInt(String(preferredStartDayOfMonth), 10)
      : 1;

    // Validate parsed number
    appAssert(
      !isNaN(preferredStartDay) && preferredStartDay >= 1 && preferredStartDay <= 15,
      BAD_REQUEST,
      "Preferred start day must be between 1 and 15"
    );

    // Handle optional fields - empty strings should be null
    const statusMsg = statusMessage && String(statusMessage).trim() ? String(statusMessage).trim() : null;
    
    // TO BE DONE: Handle avatar file upload to cloud storage
    // For now, use avatarUrl from form data if provided
    // When cloud storage is implemented, process avatarFile here
    let avatar = null;
    if (avatarFile) {
      // TODO: Upload avatarFile to cloud storage (S3, Cloudinary, etc.)
      // avatar = await uploadToCloudStorage(avatarFile);
    } else if (avatarUrl && String(avatarUrl).trim()) {
      avatar = String(avatarUrl).trim();
    }

    // Validate theme preference
    const theme = (themePreference === "light" || themePreference === "dark" || themePreference === "system")
      ? themePreference
      : "system";

    const profile = await UserProfile.create({
      userId,
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
      username: username?.trim() || null,
      dateOfBirth: dateOfBirth || null,
      statusMessage: statusMsg,
      bio: bio?.trim() || null,
      avatarUrl: avatar,
      preferredStartDayOfMonth: preferredStartDay,
      themePreference: theme,
      language: "en", // Default language (can be made configurable later)
      preferredCurrencyId: preferredCurrencyId || null,
    });
    

    const accountType = await AccountType.create({ 
      userId,
      name: "Cash",
      description: "This is a cash demo account"
    });

    await Account.create({
      userId,
      accountTypeId: accountType.id,
      currencyId: preferredCurrencyId, // Default for Romanian
      name: "Cash Account Demo - RON",
      balance: 0,
      defaultGradientId: 1
    })

    await completeSession(session);

    return res.status(OK).json({
      message: "Profile setup completed successfully",
      profile: {
        id: profile.id,
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        dateOfBirth: profile.dateOfBirth,
        statusMessage: profile.statusMessage,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        preferredStartDayOfMonth: profile.preferredStartDayOfMonth,
        themePreference: profile.themePreference,
        language: profile.language,
        preferredCurrencyId: profile.preferredCurrencyId,
      },
    });
  }
);

