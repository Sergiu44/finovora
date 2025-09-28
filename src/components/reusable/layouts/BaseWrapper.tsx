import { type PropsWithChildren } from "react";

export default function BaseWrapper(props: PropsWithChildren) {
  return <div className="px-20 py-10">{props.children}</div>;
}
