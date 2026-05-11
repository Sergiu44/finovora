import { type PropsWithChildren } from "react";
import { UserMainAccountProvider } from "../../../context/UserMainAccount";

function RouteWrapper(props: Readonly<PropsWithChildren>) {
  return <UserMainAccountProvider>{props.children}</UserMainAccountProvider>;
}

export default RouteWrapper;
