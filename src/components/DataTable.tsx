import type { Order } from "../types.ts";
import { StatusPill } from "./ui/index.ts";

function DataTable({ orders }: { orders: Order[] }) {
  return (
    <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", marginTop: "20px", overflow: "hidden" }}>
      <h3 style={{ padding: "20px 20px 0", color: "#6EE7F7" }}>Recent Orders</h3>
      <table style={{ width: "100%", minWidth: "640px", borderCollapse: "collapse", marginTop: "12px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #334155" }}>
            <th style={{ padding: "12px 20px", textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>#</th>
            <th style={{ padding: "12px 20px", textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>Customer</th>
            <th style={{ padding: "12px 20px", textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>Product</th>
            <th style={{ padding: "12px 20px", textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>Amount</th>
            <th style={{ padding: "12px 20px", textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>Date</th>
            <th style={{ padding: "12px 20px", textAlign: "left", color: "#94a3b8", fontSize: "13px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "12px 20px", color: "#e2e8f0" }}>{order.id}</td>
              <td style={{ padding: "12px 20px", color: "#e2e8f0" }}>{order.customer}</td>
              <td style={{ padding: "12px 20px", color: "#94a3b8" }}>{order.product}</td>
              <td style={{ padding: "12px 20px", color: "#e2e8f0" }}>${order.amount.toLocaleString()}</td>
              <td style={{ padding: "12px 20px", color: "#94a3b8" }}>{order.date}</td>
              <td style={{ padding: "12px 20px" }}>
                <StatusPill status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
