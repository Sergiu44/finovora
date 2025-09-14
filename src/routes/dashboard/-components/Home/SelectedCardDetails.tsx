import { Card, CardContent, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../../../components/ui/select";

interface ISelectedCardDetailsProps {
  card: { name: string };
}
export default function SelectedCardDetails(props: ISelectedCardDetailsProps) {
  return (
    <div>
      <Card>
        <CardContent>
          <CardTitle className="text-muted-foreground flex justify-between">
            <h2 className="grow-1 w-full">Balance history/statistics</h2>
            <Select defaultValue="trest-2" value="trest-2">
              <SelectTrigger className="">Test</SelectTrigger>
              <SelectContent>
                <SelectItem value="trest-2">test 2</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}
