import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { CameraIcon } from "@heroicons/react/20/solid";
import { User } from "lucide-react";

export interface PersonalInfoTabProps {
  isEditing: boolean;
  values: { [key: string]: any };
  errors: { [key: string]: any };
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInfoTab({
  isEditing,
  values,
  errors,
  onChangeInput,
  handleImageUpload,
}: PersonalInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Personal Information
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Update your personal details and profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 shadow-none">
        <div className="flex items-center gap-6 mt-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
              {values.fullName
                ?.split(" ")
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
  );
}


