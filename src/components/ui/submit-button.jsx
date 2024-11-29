import { Loader } from "lucide-react";
import { Button } from "./button";

const SubmitButton = ({ children, loading, ...props }) => {
  return (
    <Button type="submit" disabled={loading} {...props}>
      {loading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" /> Loading...
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};

export default SubmitButton;
