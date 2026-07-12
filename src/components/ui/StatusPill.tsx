import { colors, radius } from "../../theme.ts";

interface StatusPillProps {
  status: string;
}

function pickColor(status: string): string {
  switch (status) {
    case "Active":
    case "Delivered":
    case "In Stock":
      return colors.green;
    case "Inactive":
    case "Cancelled":
    case "Out of Stock":
      return colors.red;
    case "Pending":
    case "Low Stock":
      return colors.amber;
    default:
      return colors.muted;
  }
}

function StatusPill({ status }: StatusPillProps) {
  const color = pickColor(status);
  return (
    <span
      style={{
        color,
        backgroundColor: `${color}20`,
        padding: "4px 12px",
        borderRadius: radius.pill,
        fontSize: 13,
        fontWeight: 600,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default StatusPill;
