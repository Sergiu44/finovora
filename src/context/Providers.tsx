import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type PropsWithChildren } from "react";
import { UserDetailsProvider } from "./UserDetails";

export default function Providers(props: Readonly<PropsWithChildren>) {
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
      <UserDetailsProvider>{props.children}</UserDetailsProvider>
    </QueryClientProvider>
  );
}
