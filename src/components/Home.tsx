import { useCallback, useEffect, useState } from "react";
import type {
  Stat,
  RevenuePoint,
  WeeklyOrderPoint,
  CategorySlice,
  OrdersCustomersPoint,
  Order,
} from "../types.ts";
import { getAll } from "../lib/api.ts";
import { Spinner, ErrorState } from "./ui/index.ts";
import StatsCard from "./StatsCard.tsx";
import RevenueChart from "./RevenueChart.tsx";
import OrdersChart from "./OrdersChart.tsx";
import CategoryChart from "./CategoryChart.tsx";
import CustomersChart from "./CustomersChart.tsx";
import DataTable from "./DataTable.tsx";

function Home({ isMobile }: { isMobile: boolean }) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [weeklyOrders, setWeeklyOrders] = useState<WeeklyOrderPoint[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<CategorySlice[]>([]);
  const [ordersVsCustomers, setOrdersVsCustomers] = useState<OrdersCustomersPoint[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        statsData,
        revenueData,
        weeklyOrdersData,
        salesByCategoryData,
        ordersVsCustomersData,
        recentOrdersData,
      ] = await Promise.all([
        getAll<Stat>("stats"),
        getAll<RevenuePoint>("revenue"),
        getAll<WeeklyOrderPoint>("weeklyOrders"),
        getAll<CategorySlice>("salesByCategory"),
        getAll<OrdersCustomersPoint>("ordersVsCustomers"),
        getAll<Order>("recentOrders"),
      ]);
      setStats(statsData);
      setRevenue(revenueData);
      setWeeklyOrders(weeklyOrdersData);
      setSalesByCategory(salesByCategoryData);
      setOrdersVsCustomers(ordersVsCustomersData);
      setRecentOrders(recentOrdersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div>
      <h1>Home</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "30px" }}>
        {stats.map((stat) => (
          <StatsCard key={stat.id} stat={stat} />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <RevenueChart data={revenue} />
        <OrdersChart data={weeklyOrders} />
        <CategoryChart data={salesByCategory} />
        <CustomersChart data={ordersVsCustomers} />
      </div>
      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <DataTable orders={recentOrders} />
      </div>
    </div>
  );
}

export default Home;
