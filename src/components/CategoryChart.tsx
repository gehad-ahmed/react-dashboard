import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { CategorySlice } from "../types.ts";
import { chartColors } from "../theme.ts";

function CategoryChart({ data }: { data: CategorySlice[] }) {
  return (
    <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px" }}>
      <h3 style={{ color: "#34D399", marginBottom: "16px" }}>Sales by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={4}>
            {data.map((_, index) => (
              <Cell key={index} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
