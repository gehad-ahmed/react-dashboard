export interface Client {
  id: string;
  name: string;
  industry: string;
  status: "Active" | "Inactive";
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  date: string;
  status: "Delivered" | "Pending" | "Cancelled";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export interface Stat {
  id: string;
  key: string;
  label: string;
  value: number;
  color: string;
}

export interface RevenuePoint {
  id: string;
  month: string;
  revenue: number;
}

export interface WeeklyOrderPoint {
  id: string;
  day: string;
  orders: number;
}

export interface CategorySlice {
  id: string;
  name: string;
  value: number;
}

export interface OrdersCustomersPoint {
  id: string;
  month: string;
  orders: number;
  customers: number;
}
