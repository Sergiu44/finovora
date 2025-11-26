import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { EnvelopeIcon } from "@heroicons/react/20/solid";

export interface AccountDetailsTabProps {
  isEditing: boolean;
  values: { [key: string]: any };
  errors: { [key: string]: any };
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AccountDetailsTab({
  isEditing,
  values,
  errors,
  onChangeInput,
}: AccountDetailsTabProps) {
  return (
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
  );
}


