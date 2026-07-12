//bar chart

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { WeeklyOrderPoint } from "../types.ts";
import CustomTooltip from "./CustomTooltip.tsx";

function OrdersChart({ data }: { data: WeeklyOrderPoint[] }) {
  return (
    <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px" }}>
      <h3>Weekly Orders</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="orders" fill="#A78BFA" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrdersChart;
