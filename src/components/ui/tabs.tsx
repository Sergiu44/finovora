import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        "flex flex-col gap-2 w-full border-b border-border",
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "inline-flex h-10 w-fit items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-muted rounded-lg p-[3px]",
        underline: "",
      },
    },
  }
);

function TabsList({
  variant,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant, className }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  "box-border border-b-2 min-w-fit border-transparent text-[14px]! cursor-pointer hover:border-light-gray data-[state=active]:border-light-gray dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 px-4 py-1 transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-black text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "dark:data-[state=active]:bg-input/30 rounded-sm mx-0.5",
        underline:
          "data-[state=active]:border-b-2 data-[state=active]:border-primary hover:border-primary/30 -mb-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function TabsTrigger({
  variant,
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, className }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
