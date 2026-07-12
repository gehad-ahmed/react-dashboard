//area chart

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { RevenuePoint } from "../types.ts";
import CustomTooltip from "./CustomTooltip.tsx";

function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px" }}>
      <h3>Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#6EE7F7" fill="#6EE7F7" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
