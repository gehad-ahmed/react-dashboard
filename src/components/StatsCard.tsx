import type { Stat } from "../types.ts";
import { colors } from "../theme.ts";

function StatsCard({ stat }: { stat: Stat }) {
  return (
    <div
      style={{
        backgroundColor: colors.panel,
        padding: "20px",
        borderRadius: "12px",
        flex: "1 1 150px",
        minWidth: "150px",
      }}
    >
      <p style={{ color: stat.color }}>{stat.label}</p>
      <h2>{stat.value.toLocaleString()}</h2>
    </div>
  );
}

export default StatsCard;
