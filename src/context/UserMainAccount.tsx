import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { getUserAccount } from "../actions/accounts/userAccounts";

interface UserMainAccountContextState {
  userMainAccountId?: number;
  setUserMainAccountId: (id: number) => void;
  account: any;
  status: "pending" | "error" | "success";
}

const UserMainAccountContext = createContext<UserMainAccountContextState>({
  userMainAccountId: undefined,
  setUserMainAccountId: () => {},
  account: null,
  status: "pending",
});

export const UserMainAccountProvider = (props: PropsWithChildren) => {
  const [userMainAccountId, setUserMainAccountId] = useState<number | undefined>(undefined);

  const { data, status } = useQuery({
    queryKey: ["userMainAccount", userMainAccountId],
    queryFn: async () => {
      if (userMainAccountId) {
        return getUserAccount(userMainAccountId);
      }
    },
  });
  return (
    <UserMainAccountContext.Provider value={{ account: data, status, userMainAccountId, setUserMainAccountId }}>
      {props.children}
    </UserMainAccountContext.Provider>
  );
};

export const useUserMainAccount = () => useContext(UserMainAccountContext);
