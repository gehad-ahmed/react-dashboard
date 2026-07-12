import { FiInbox } from "react-icons/fi";
import { colors } from "../../theme.ts";

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        padding: 40,
        color: colors.muted,
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
          backgroundColor: `${colors.muted}1a`,
          color: colors.muted,
        }}
      >
        <FiInbox size={28} />
      </div>
      <span style={{ fontSize: 15 }}>{message}</span>
    </div>
  );
}

export default EmptyState;
