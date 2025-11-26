import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/20/solid";

export interface PreferencesTabProps {
  isEditing: boolean;
}

export function PreferencesTab({ isEditing }: PreferencesTabProps) {
  return (
    <Card>
      <CardHeader className="mb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          Preferences
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">Customize your experience and notification settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-2">
            <Label htmlFor="startDay">Start Day</Label>
            <Select disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="Select start day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, index) => (
                  <SelectItem key={index+1} value={(index+1).toString()}>
                    {index+1}
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


