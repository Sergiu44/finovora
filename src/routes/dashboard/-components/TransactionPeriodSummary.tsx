import { subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";

interface SummaryProps {
  monthValue: Date;
  periodLabel: string;
  onChangeMonth: (val: Date) => void;
  className?: string;
}

export default function TransactionPeriodSummary({
  monthValue,
  periodLabel,
  onChangeMonth,
  className = "",
}: SummaryProps) {
  return (
    <div
      className={`mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-center justify-between gap-1 w-[200px]">
        <ChevronLeft onClick={() => onChangeMonth(subMonths(monthValue, 1))} />
        <p className="text-lg font-semibold text-foreground">
          {moment(monthValue).format("MMMM YYYY")}
        </p>
        <ChevronRight onClick={() => onChangeMonth(addMonths(monthValue, 1))} />
      </div>
      <div className="text-sm text-muted-foreground sm:text-right">
        <span className="text-[11px] uppercase tracking-wide">Date range</span>
        <p className="text-base font-semibold text-foreground">{periodLabel}</p>
      </div>
    </div>
  );
}
