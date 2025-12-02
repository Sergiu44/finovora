import React, { forwardRef } from "react";

interface SectionBandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SectionBand = forwardRef<HTMLDivElement, SectionBandProps>(
  ({ className = "", children, ...rest }, ref) => {
    return (
      <div ref={ref} className={`px-20 py-24 ${className}`.trim()} {...rest}>
        {children}
      </div>
    );
  }
);

SectionBand.displayName = "SectionBand";

interface SectionInnerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SectionInner: React.FC<SectionInnerProps> = ({
  className = "",
  children,
  ...rest
}) => {
  return (
    <div className={`lg:w-[65%] w-[80%] mx-auto ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
};
