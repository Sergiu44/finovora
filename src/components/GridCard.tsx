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

export default function GridCard({
  title,
  wrapperClassname = "col-span-1",
  className,
  size,
  children,
}: GridCardProps) {
  const renderTitle = useCallback(() => {
    switch (size) {
      case "lg":
        return <h2 className="mb-4!">{title.text}</h2>;
      case "sm":
        return <p className="mb-2!">{title.text}</p>;
      default:
        return <h3 className="mb-3!">{title.text}</h3>;
    }
  }, [size]);
  return (
    <div className={wrapperClassname}>
      {!title.inside && renderTitle()}
      <div
        className={`${size ? `grid-card grid-card-${size}` : "grid-card"} ${className}`}
      >
        {title.inside && renderTitle()}
        {children}
      </div>
    </div>
  );
}
