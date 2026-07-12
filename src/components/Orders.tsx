import { useEffect, useMemo, useState } from "react";
import type { Order } from "../types.ts";
import { getAll, create, update, remove } from "../lib/api.ts";
import { colors, radius, spacing, rowHoverBg, transitions } from "../theme.ts";
import {
  Card,
  Button,
  Field,
  Input,
  Select,
  StatusPill,
  SkeletonTable,
  ErrorState,
  EmptyState,
  useToast,
} from "./ui/index.ts";

const RESOURCE = "recentOrders";

type OrderStatus = Order["status"];
const STATUSES: OrderStatus[] = ["Delivered", "Pending", "Cancelled"];
type StatusFilter = "All" | OrderStatus;

interface FormData {
  customer: string;
  product: string;
  amount: string;
  date: string;
  status: OrderStatus;
}

const emptyForm: FormData = {
  customer: "",
  product: "",
  amount: "",
  date: "",
  status: "Pending",
};

const PAGE_SIZE = 5;

function Orders() {
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Show the inline validation message only after a submit attempt or after
  // the user has touched (blurred) a required field.
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAll<Order>(RESOURCE);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        q === "" ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const amountNum = Number(formData.amount);
  const customerValid = formData.customer.trim().length > 0;
  const productValid = formData.product.trim().length > 0;
  const amountValid =
    formData.amount.trim() !== "" && Number.isFinite(amountNum) && amountNum >= 0;
  const dateValid = formData.date.trim() !== "";
  const formValid = customerValid && productValid && amountValid && dateValid;

  function resetForm() {
    setFormData(emptyForm);
    setEditId(null);
    setSubmitAttempted(false);
    setTouched(false);
  }

  async function handleAdd() {
    const body = {
      customer: formData.customer.trim(),
      product: formData.product.trim(),
      amount: amountNum,
      date: formData.date,
      status: formData.status,
    };
    setSubmitting(true);
    try {
      const created = await create<Order>(RESOURCE, body);
      setOrders((prev) => [...prev, created]);
      toast("Order added", "success");
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Orders] add failed:", err);
      toast(`Failed to add order: ${msg}`, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!editId) return;
    const body: Order = {
      id: editId,
      customer: formData.customer.trim(),
      product: formData.product.trim(),
      amount: amountNum,
      date: formData.date,
      status: formData.status,
    };
    setSubmitting(true);
    try {
      const updated = await update<Order>(RESOURCE, editId, body);
      const next = updated && updated.id ? updated : body;
      setOrders((prev) => prev.map((o) => (o.id === editId ? next : o)));
      toast("Order updated", "success");
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Orders] update failed:", err);
      toast(`Failed to update order: ${msg}`, "error");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit() {
    setSubmitAttempted(true);
    if (!formValid || submitting) return;
    if (editId) {
      handleUpdate();
    } else {
      handleAdd();
    }
  }

  function handleEdit(order: Order) {
    setFormData({
      customer: order.customer,
      product: order.product,
      amount: String(order.amount),
      date: order.date,
      status: order.status,
    });
    setEditId(order.id);
    setSubmitAttempted(false);
    setTouched(false);
  }

  async function handleDelete(id: string) {
    try {
      await remove(RESOURCE, id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (editId === id) resetForm();
      toast("Order deleted", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Orders] delete failed:", err);
      toast(`Failed to delete order: ${msg}`, "error");
    }
  }

  const thStyle = {
    padding: "14px 20px",
    textAlign: "left" as const,
    fontSize: 13,
    fontWeight: 600,
  };
  const tdStyle = { padding: "12px 20px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.xl }}>
      <h3 style={{ color: colors.text, margin: 0 }}>Orders</h3>

      {/* Add / Edit form */}
      <Card title={editId ? "Edit order" : "Add new order"}>
        <div
          style={{
            display: "flex",
            gap: spacing.md,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Field label="Customer" style={{ flex: 1, minWidth: 160 }}>
            <Input
              value={formData.customer}
              placeholder="Customer name"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
            />
          </Field>

          <Field label="Product" style={{ flex: 1, minWidth: 150 }}>
            <Input
              value={formData.product}
              placeholder="Product"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
            />
          </Field>

          <Field label="Amount" style={{ minWidth: 120 }}>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={formData.amount}
              placeholder="0"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </Field>

          <Field label="Date" style={{ minWidth: 150 }}>
            <Input
              type="date"
              value={formData.date}
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </Field>

          <Field label="Status" style={{ minWidth: 140 }}>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as OrderStatus,
                })
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          <Button
            variant={editId ? "warning" : "primary"}
            disabled={!formValid || submitting}
            onClick={handleSubmit}
          >
            {editId ? "Update" : "Add"}
          </Button>

          {editId && (
            <Button variant="ghost" disabled={submitting} onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>

        {!formValid && (submitAttempted || touched) && (
          <p
            style={{
              color: colors.red,
              fontSize: 13,
              margin: 0,
              marginTop: spacing.md,
            }}
          >
            Customer, product and date are required, and amount must be 0 or more.
          </p>
        )}
      </Card>

      {/* Table + filters */}
      <Card>
        <div
          style={{
            display: "flex",
            gap: spacing.md,
            alignItems: "flex-end",
            flexWrap: "wrap",
            marginBottom: spacing.lg,
          }}
        >
          <Field label="Search" style={{ flex: 1, minWidth: 200 }}>
            <Input
              value={search}
              placeholder="Search by customer or product"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>

          <Field label="Status" style={{ minWidth: 160 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="All">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {loading ? (
          <SkeletonTable rows={PAGE_SIZE} columns={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No orders found." />
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th style={{ ...thStyle, color: colors.cyan }}>Customer</th>
                    <th style={{ ...thStyle, color: colors.purple }}>Product</th>
                    <th style={{ ...thStyle, color: colors.green }}>Amount</th>
                    <th style={{ ...thStyle, color: colors.amber }}>Date</th>
                    <th style={{ ...thStyle, color: colors.cyan }}>Status</th>
                    <th style={{ ...thStyle, color: colors.red }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((order) => (
                    <tr
                      key={order.id}
                      onMouseEnter={() => setHoveredRow(order.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor:
                          hoveredRow === order.id ? rowHoverBg : "transparent",
                        transition: `background-color ${transitions.fast}`,
                      }}
                    >
                      <td style={{ ...tdStyle, color: colors.text }}>
                        {order.customer}
                      </td>
                      <td style={{ ...tdStyle, color: colors.muted }}>
                        {order.product}
                      </td>
                      <td style={{ ...tdStyle, color: colors.text }}>
                        {"$" + order.amount.toLocaleString()}
                      </td>
                      <td style={{ ...tdStyle, color: colors.muted }}>
                        {order.date}
                      </td>
                      <td style={tdStyle}>
                        <StatusPill status={order.status} />
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: spacing.sm }}>
                          <Button
                            variant="warning"
                            style={{ padding: "4px 12px", fontSize: 13 }}
                            onClick={() => handleEdit(order)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            style={{ padding: "4px 12px", fontSize: 13 }}
                            onClick={() => handleDelete(order.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: spacing.lg,
                gap: spacing.md,
              }}
            >
              <span style={{ color: colors.muted, fontSize: 13 }}>
                Page {safePage} of {totalPages}
              </span>
              <div style={{ display: "flex", gap: spacing.sm }}>
                <Button
                  variant="ghost"
                  style={{ padding: "6px 14px", borderRadius: radius.sm }}
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  variant="ghost"
                  style={{ padding: "6px 14px", borderRadius: radius.sm }}
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default Orders;
