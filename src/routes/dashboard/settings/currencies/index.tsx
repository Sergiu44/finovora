import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";

export const Route = createFileRoute("/dashboard/settings/currencies/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState("0");

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (Number(ev.key) >= 0 && Number(ev.key) <= 9) {
        console.log(ev.key, value);
        setValue((prevState) =>
          prevState === "0" ? ev.key : prevState + ev.key
        );
      }
      if (ev.key === "Backspace") {
        setValue((prevState) => prevState.slice(0, -1) || "0");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 place-items-center">
      <div className="flex gap-2 items-center font-bold">
        <span className="text-muted-foreground">RON</span>
        <Input
          value={value}
          className="w-min bg-transparent border-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
