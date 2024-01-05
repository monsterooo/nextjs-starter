import { Alert, AlertDescription } from "@/components/ui/alert";

type SuccessMessageProps = {
  message?: string;
};

const SuccessMessage = ({ message }: SuccessMessageProps) => {
  if (!message) return null;

  return (
    <Alert variant="success" className="py-2">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default SuccessMessage;
