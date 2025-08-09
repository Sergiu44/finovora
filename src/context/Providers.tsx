import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type PropsWithChildren } from "react";
import { UserMainAccountProvider } from "./UserMainAccount";

export default function Providers(props: PropsWithChildren) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserMainAccountProvider>{props.children}</UserMainAccountProvider>
    </QueryClientProvider>
  );
}
