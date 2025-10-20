import { type PropsWithChildren } from "react";

export default function BaseWrapper(props: PropsWithChildren) {
  return (
    <div className="px-20 py-10 min-h-[calc(100vh-64px-92px)]">
      {props.children}
    </div>
  );
}
