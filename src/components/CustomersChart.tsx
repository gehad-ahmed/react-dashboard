import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { OrdersCustomersPoint } from "../types.ts";
import CustomTooltip from "./CustomTooltip.tsx";

function CustomersChart({ data }: { data: OrdersCustomersPoint[] }) {
  return (
    <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px" }}>
      <h3 style={{ color: "#FBBF24", marginBottom: "16px" }}>Orders vs Customers</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="orders" stroke="#A78BFA" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="customers" stroke="#34D399" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomersChart;
