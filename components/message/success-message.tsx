import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SuccessMessageProps = {
  message?: string;
  className?: string;
};

const SuccessMessage = ({ message, className }: SuccessMessageProps) => {
  if (!message) return null;

  return (
    <Alert variant="success" className={cn("py-2", className)}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default SuccessMessage;
