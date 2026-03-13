import CachedSelect from "../../../../../components/reusable/selects/CachedSelect";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";

export interface PreferencesTabProps {
  values: { [key: string]: any };
  errors: { [key: string]: any };
  onChangeValue: (key: string, value: string) => void;
  isEditing: boolean;
}

export function PreferencesTab({
  values,
  errors,
  onChangeValue,
  isEditing,
}: PreferencesTabProps) {
  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          Preferences
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Customize your experience and notification settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="preferredCurrency">Preferred Currency</Label>
            <CachedSelect
              disabled={!isEditing}
              entityName="currencies"
              placeholder="Select currency"
              name="preferredCurrency"
              onChange={(e: string) => onChangeValue("preferredCurrency", e)}
              value={values.preferredCurrency}
              errorMessage={errors.preferredCurrency}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDay">Start Day</Label>
            <Select
              disabled={!isEditing}
              name="preferredStartDayOfMonth"
              value={values.preferredStartDayOfMonth}
              onValueChange={(e: string) =>
                onChangeValue("preferredStartDayOfMonth", e)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select start day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
