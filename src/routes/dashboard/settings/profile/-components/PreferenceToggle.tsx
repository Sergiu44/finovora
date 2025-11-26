interface PreferenceToggleProps {
  label: string;
  description: string;
  disabled: boolean;
}

export function PreferenceToggle({ label, description, disabled }: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <input
        type="checkbox"
        disabled={disabled}
        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
      />
    </div>
  );
}


