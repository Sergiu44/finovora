import { startOfMonth, endOfMonth, format } from "date-fns";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export type TransactionGroupBy = "year" | "quarter" | "month" | "week";

const TransactionsPreferencesContext = createContext<{
  setCurrentDate: Dispatch<SetStateAction<Date>>;
  transactionGroupType: TransactionGroupBy;
  currentDate: Date;
  currentDateRange: { from: Date; to: Date };
}>({
  transactionGroupType: "month",
  currentDate: new Date(),
  currentDateRange: { from: new Date(), to: new Date() },
  setCurrentDate: () => {},
});

export default function TransactionsPreferencesProvider(
  props: PropsWithChildren,
) {
  const [transactionGroupType, setTransactionGroupType] =
    useState<TransactionGroupBy>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const currentDateRange = useMemo(() => {
    return {
      from: startOfMonth(currentDate),
      to: endOfMonth(currentDate),
    };
  }, [currentDate]);

  return (
    <TransactionsPreferencesContext.Provider
      value={{
        transactionGroupType,
        currentDate,
        currentDateRange,
        setCurrentDate,
      }}
    >
      {props.children}
    </TransactionsPreferencesContext.Provider>
  );
}

export const useTransactionsPreferences = () =>
  useContext(TransactionsPreferencesContext);
