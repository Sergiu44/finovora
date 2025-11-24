import { Card, CardContent, CardTitle } from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

// interface ISelectedCardDetailsProps {
//   card: { name: string };
// }
export default function SelectedCardDetails() {
  return (
    <div>
      {/* <Card className="shadow-accent-foreground">
        <CardContent>
          <CardTitle className="text-muted-foreground flex justify-between">
            <h2 className="grow-1 w-full">Balance history/statistics</h2>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Timestamp" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardContent>
      </Card> */}
    </div>
  );
}
