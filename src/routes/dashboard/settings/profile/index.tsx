import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useState } from "react";
import { useValidation } from "../../../../utils/hooks/useValidation/useValidation";
import Validator from "../../../../utils/hooks/useValidation/Validator";
import VALIDATIONS from "../../../../utils/hooks/useValidation";
import {
  UserIcon,
  CameraIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="account">Account Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                    {values.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                      <CameraIcon className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{values.fullName}</h3>
                  <p className="text-muted-foreground">@{values.username}</p>
                  {isEditing && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Click the camera icon to change your profile picture
                    </p>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={values.fullName}
                    onChange={onChangeInput}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={values.username}
                    onChange={onChangeInput}
                    disabled={!isEditing}
                    placeholder="Enter your username"
                    className={errors.username ? "border-destructive" : ""}
                  />
                  {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={onChangeInput}
                    disabled={!isEditing}
                    className={errors.dateOfBirth ? "border-destructive" : ""}
                  />
                  {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusMessage">Status Message</Label>
                  <Input
                    id="statusMessage"
                    name="statusMessage"
                    value={values.statusMessage}
                    onChange={onChangeInput}
                    disabled={!isEditing}
                    placeholder="How are you feeling today?"
                    className={errors.statusMessage ? "border-destructive" : ""}
                  />
                  {errors.statusMessage && <p className="text-sm text-destructive">{errors.statusMessage}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Bio / Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={onChangeInput}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className={`w-full min-h-[100px] px-3 py-2 border rounded-md bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.description ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                Account Details
              </CardTitle>
              <CardDescription>Manage your account information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={onChangeInput}
                  disabled={!isEditing}
                  placeholder="Enter your email address"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                <p className="text-sm text-muted-foreground">
                  This email is used for account notifications and password recovery
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={values.currentPassword}
                  onChange={onChangeInput}
                  disabled={!isEditing}
                  placeholder="Enter current password to make changes"
                  className={errors.currentPassword ? "border-destructive" : ""}
                />
                {errors.currentPassword && <p className="text-sm text-destructive">{errors.currentPassword}</p>}
              </div>

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={values.newPassword}
                      onChange={onChangeInput}
                      placeholder="Enter new password"
                      className={errors.newPassword ? "border-destructive" : ""}
                    />
                    {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={onChangeInput}
                      placeholder="Confirm new password"
                      className={errors.confirmPassword ? "border-destructive" : ""}
                    />
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    {values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="cet">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Transaction Alerts</p>
                      <p className="text-xs text-muted-foreground">Get notified about large transactions</p>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Weekly Reports</p>
                      <p className="text-xs text-muted-foreground">Receive weekly financial summaries</p>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
