import { FiAlertCircle } from "react-icons/fi";
import { colors } from "../../theme.ts";
import Button from "./Button.tsx";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: `${colors.red}1a`,
          color: colors.red,
        }}
      >
        <FiAlertCircle size={28} />
      </div>
      <p style={{ color: colors.red, margin: 0, fontSize: 15, maxWidth: 360 }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
