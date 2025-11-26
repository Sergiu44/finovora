import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "../../../../components/ui/button";
import { type PropsWithChildren } from "react";

interface SettingsPageHeaderProps {
  title: string;
  description?: string;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  actions?: React.ReactNode;
}

export function SettingsPageHeader({
  title,
  description,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  actions,
}: SettingsPageHeaderProps) {
  const renderActions = () => {
    if (actions) return actions;
    if (!onEdit) return null;

    if (isEditing) {
      return (
        <>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave}>
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </>
      );
    }

    return (
      <Button onClick={onEdit}>
        Edit Profile
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex gap-2">{renderActions()}</div>
    </div>
  );
}

interface SettingsPageLayoutProps
  extends SettingsPageHeaderProps,
    PropsWithChildren {
  className?: string;
}

export function SettingsPageLayout({
  className,
  children,
  ...headerProps
}: SettingsPageLayoutProps) {
  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${className ?? ""}`}>
      <SettingsPageHeader {...headerProps} />
      {children}
    </div>
  );
}

