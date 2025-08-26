import { useCallback, type PropsWithChildren } from "react";
import type { BaseProps } from "../types/components/BaseProps";

interface TitleGridCardProps {
  inside: boolean;
  text: string;
}

interface GridCardProps extends PropsWithChildren<BaseProps> {
  title: TitleGridCardProps;
  wrapperClassname?: string;
}

export default function GridCard({ title, wrapperClassname = "col-span-1", className, children }: GridCardProps) {
  return (
    <div className={wrapperClassname}>
      {!title.inside && <h1>{title.text}</h1>}
      <div className={`${className}`}>
        {title.inside && <h1>{title.text}</h1>}
        {children}
      </div>
    </div>
  );
}
