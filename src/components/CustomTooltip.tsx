interface TooltipEntry {
  name?: string | number;
  value?: string | number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 8px" }}>{label}</p>
      {payload.map((entry, index) => (
        <p
          key={index}
          style={{ color: entry.color, fontSize: "14px", fontWeight: 600, margin: "4px 0" }}
        >
          {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}

export default CustomTooltip;
