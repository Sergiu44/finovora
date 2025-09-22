import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

export default function ErrorMessage({
  errorMessage,
  wrapperClassName = "",
}: {
  errorMessage: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={`flex gap-1 items-center mt-1.5 ${wrapperClassName}`}>
      <ExclamationTriangleIcon className="h-3 w-3 text-destructive" />
      <p className="text-destructive">{errorMessage}</p>
    </div>
  );
}
