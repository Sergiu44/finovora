import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { useState } from "react";
import { useValidation } from "../../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../../../utils/hooks/useValidation";
import { SettingsPageLayout } from "../-components/SettingsPageHeader";
import { PersonalInfoTab } from "./-components/PersonalInfoTab";
import { AccountDetailsTab } from "./-components/AccountDetailsTab";
import { PreferencesTab } from "./-components/PreferencesTab";

export const Route = createFileRoute("/dashboard/settings/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Form validation setup
  const { values, errors, onChangeInput, handleCheckFormErrors } = useValidation(
    new Validator()
      .forProperty("fullName", "John Doe")
      .check(VALIDATIONS.isRequired, "Full name is required.")
      .check(VALIDATIONS.minLength(2), "Full name must be at least 2 characters.")
      .forProperty("username", "johndoe")
      .check(VALIDATIONS.isRequired, "Username is required.")
      .check(VALIDATIONS.minLength(3), "Username must be at least 3 characters.")
      .check(VALIDATIONS.isAlphanumeric, "Username can only contain letters and numbers.")
      .forProperty("email", "john.doe@example.com")
      .check(VALIDATIONS.isRequired, "Email is required.")
      .check(VALIDATIONS.isEmail, "Please enter a valid email address.")
      .forProperty("description", "Financial enthusiast and budget tracker")
      .check(VALIDATIONS.maxLength(500), "Description must be less than 500 characters.")
      .forProperty("dateOfBirth", "1990-05-15")
      .check(VALIDATIONS.isRequired, "Date of birth is required.")
      .forProperty("statusMessage", "Feeling great about my financial progress! 💰")
      .check(VALIDATIONS.maxLength(100), "Status message must be less than 100 characters.")
      .forProperty("currentPassword", "")
      .forProperty("newPassword", "")
      .check(VALIDATIONS.minLength(8), "Password must be at least 8 characters.")
      .forProperty("confirmPassword", "")
      .applyCheckOnlyOnSubmit()
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleSave = () => {
    if (handleCheckFormErrors()) {
      return;
    }

    // Here you would typically save the data to your backend
    console.log("Saving profile data:", { ...values, profileImage });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values if needed
  };

  return (
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
          <PreferencesTab isEditing={isEditing} />
        </TabsContent>
      </Tabs>
    </SettingsPageLayout>
  );
}
