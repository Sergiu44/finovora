import { createFileRoute } from "@tanstack/react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { useEffect, useState } from "react";
import { useValidation } from "../../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../../../utils/hooks/useValidation";
import { SettingsPageLayout } from "../-components/SettingsPageHeader";
import { PersonalInfoTab } from "./-components/PersonalInfoTab";
import { AccountDetailsTab } from "./-components/AccountDetailsTab";
import { PreferencesTab } from "./-components/PreferencesTab";
import { useUserDetails } from "../../../../context/UserDetails";
import { PlaceholderMissingProfile } from "../../../../components/reusable/placeholderMissingProfile/PlaceholderMissingProfile";
import { getUserProfile, updateUserProfile } from "../../../../utils/actions/users/userProfiles";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings/profile/")({
  component: RouteComponent,
});

export function ProfileSettingsView() {
  const { user } = useUserDetails();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => getUserProfile(),
    enabled: Boolean(user?.id)
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error("Failed to update profile", {
        description: error?.response?.data?.message || "Please try again.",
      });
    },
  });

  // Form validation setup
  const { values, setValues, errors, onChangeValue, onChangeInput, handleCheckFormErrors } =
    useValidation(
      new Validator()
        .forProperty("firstName", "John Doe")
        .check(VALIDATIONS.isRequired, "First name is required.")
        .check(
          VALIDATIONS.minLength(2),
          "First name must be at least 2 characters."
        )
        .forProperty("lastName", "Doe")
        .check(VALIDATIONS.isRequired, "Last name is required.")
        .check(
          VALIDATIONS.minLength(2),
          "Last name must be at least 2 characters."
        )
        .forProperty("username", "johndoe")
        .check(VALIDATIONS.isRequired, "Username is required.")
        .check(
          VALIDATIONS.minLength(3),
          "Username must be at least 3 characters."
        )
        .check(
          VALIDATIONS.isText,
          "Username can only contain letters, numbers and special characters."
        )
        .forProperty("email", "john.doe@example.com")
        .check(VALIDATIONS.isRequired, "Email is required.")
        .check(VALIDATIONS.isEmail, "Please enter a valid email address.")
        .forProperty("description", "Financial enthusiast and budget tracker")
        .check(
          VALIDATIONS.maxLength(500),
          "Description must be less than 500 characters."
        )
        .forProperty("dateOfBirth", "1990-05-15")
        .check(VALIDATIONS.isRequired, "Date of birth is required.")
        .forProperty(
          "statusMessage",
          "Feeling great about my financial progress! 💰"
        )
        .check(
          VALIDATIONS.maxLength(100),
          "Status message must be less than 100 characters."
        )
        .forProperty("currentPassword", "")
        .forProperty("newPassword", "")
        .check(
          VALIDATIONS.minLength(8),
          "Password must be at least 8 characters."
        )
        .forProperty("confirmPassword", "")
        .applyCheckOnlyOnSubmit()
    );

  const handleImageUpload = () => {
    // Future enhancement: upload preview
  };

  const handleSave = async () => {
    if (handleCheckFormErrors()) {
      return;
    }

    updateProfileMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      dateOfBirth: values.dateOfBirth,
      statusMessage: values.statusMessage,
      bio: values.description,
      preferredStartDayOfMonth: Number(values.preferredStartDayOfMonth),
      themePreference: values.themePreference as "light" | "dark" | "system",
      preferredCurrencyId: values.preferredCurrency,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values if needed
  };

  const canEditProfile = Boolean(user?.hasProfile);

  useEffect(() =>{
    if(userProfile) {
      setValues({
        firstName: userProfile.firstName ?? "",
        lastName: userProfile.lastName ?? "",
        username: userProfile.username ?? "",
        email: user?.email ?? "",
        description: userProfile.statusMessage ?? "",
        dateOfBirth: userProfile.dateOfBirth ?? "",
        statusMessage: userProfile.statusMessage ?? "",
        preferredStartDayOfMonth: userProfile.preferredStartDayOfMonth.toString(),
        themePreference: userProfile.themePreference,
        preferredCurrencyId: userProfile.preferredCurrencyId ?? "",
      });
    }
  }, [userProfile, setValues])

  return canEditProfile ? (
    <SettingsPageLayout
      title="Profile Settings"
      description="Manage your personal information and preferences"
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <Tabs defaultValue="personal" className="w-full shadow-none border-none">
        <TabsList variant="default">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="account">Account Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoTab
            isEditing={isEditing}
            values={values}
            errors={errors}
            onChangeInput={onChangeInput}
            handleImageUpload={handleImageUpload}
          />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <AccountDetailsTab
            isEditing={isEditing}
            values={values}
            errors={errors}
            onChangeInput={onChangeInput}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesTab isEditing={isEditing} values={values} errors={errors} onChangeValue={onChangeValue} />
        </TabsContent>
      </Tabs>
    </SettingsPageLayout>
  ) : (
    <PlaceholderMissingProfile />
  );
}

function RouteComponent() {
  return <ProfileSettingsView />;
}
