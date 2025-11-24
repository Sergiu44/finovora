import { type PropsWithChildren } from "react";

export default function BaseWrapper(props: PropsWithChildren) {
  return (
    <div className="lg:px-12 sm:px-6 px-4 py-10 min-h-[calc(100vh-64px-92px)]">
      {props.children}
    </div>
  );
}
