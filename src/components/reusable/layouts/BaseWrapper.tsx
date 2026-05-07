import { type PropsWithChildren } from "react";

type BaseWrapperProps = {
  title: string;
  subtitle?: string;
}

export default function BaseWrapper(props: PropsWithChildren<BaseWrapperProps>) {
  return (
    <div className="lg:px-12 sm:px-6 px-4 py-10 min-h-[calc(100vh-64px-92px)]">
      {props.title && <h1 className="text-3xl font-bold ml-2.5">{props.title}</h1>}
      {props.subtitle && <p className="text-sm text-muted-foreground ml-2.5">{props.subtitle}</p>}
      {props.children}
    </div>
  );
}
