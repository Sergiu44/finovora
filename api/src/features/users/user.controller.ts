import { Request, Response } from "express";
import catchErrors from "../../utils/utilities/catchErrors";
import User from "./user";
import appAssert from "../../utils/utilities/appAssert";
import { NOT_FOUND, OK } from "../../utils/constants/http";
import { UserProfile } from "./userProfiles/userProfile";
import { updateUserProfileSchema, UpdateUserProfileSchema } from "./user.schemas";

export const getUserHandler = catchErrors(
  async (req: Request, res: Response) => {
    const user = await User.findByPk(req.userId);
    appAssert(user, NOT_FOUND, "User not found");
    return res.status(200).json(user.omitPassword());
  }
);

export const getUserProfileHandler = catchErrors(
  async (req: Request, res: Response) => {
    console.log(req.userId);
    const userProfile = await UserProfile.findOne({ where: { userId: req.userId! } });
    appAssert(userProfile, NOT_FOUND, "User Profile not found");
    return res.status(200).json(userProfile);
  }
);

export const updateUserProfileHandler = catchErrors(
  async (req: Request, res: Response) => {
    const userId = req.userId!;
    // Body is already validated by validateDto middleware
    const updateData = req.body;

    const userProfile = await UserProfile.findOne({ where: { userId } });
    appAssert(userProfile, NOT_FOUND, "User Profile not found");

    // Update all profile fields (updateData contains all fields with previous values for unchanged ones)
    userProfile.firstName = updateData.firstName;
    userProfile.lastName = updateData.lastName;
    userProfile.username = updateData.username;
    userProfile.dateOfBirth = updateData.dateOfBirth;
    userProfile.statusMessage = updateData.statusMessage;
    userProfile.bio = updateData.bio;
    userProfile.preferredStartDayOfMonth = updateData.preferredStartDayOfMonth;
    userProfile.themePreference = updateData.themePreference;
    userProfile.preferredCurrencyId = updateData.preferredCurrencyId;

    await userProfile.save();

    return res.status(OK).json({
      message: "Profile updated successfully",
      profile: userProfile,
    });
  }
);
