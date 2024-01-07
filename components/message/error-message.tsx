import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ErrorMessageProps = {
  message?: string;
  className?: string;
};

const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className={cn("py-2", className)}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
