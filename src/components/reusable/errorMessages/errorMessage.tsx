import { AlertCircle } from "lucide-react";

export default function ErrorMessage({
  errorMessage,
  wrapperClassName = "",
}: {
  errorMessage: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={`flex gap-1 items-center mt-1.5 ${wrapperClassName}`}>
      <AlertCircle className="h-3 w-3 text-destructive" />
      <p className="text-destructive">{errorMessage}</p>
    </div>
  );
}
