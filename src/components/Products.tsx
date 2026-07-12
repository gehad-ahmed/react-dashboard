import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types.ts";
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

type ProductStatus = Product["status"];

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Books",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];
type CategoryFilter = "All" | Category;

interface FormData {
  name: string;
  category: Category;
  price: string;
  stock: string;
}

const emptyForm: FormData = {
  name: "",
  category: "Electronics",
  price: "",
  stock: "",
};

const PAGE_SIZE = 5;

function deriveStatus(stock: number): ProductStatus {
  if (stock === 0) return "Out of Stock";
  if (stock < 10) return "Low Stock";
  return "In Stock";
}

function Products() {
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
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
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAll<Product>("products");
      setProducts(data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Reset to first page whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = q === "" || p.name.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const nameValid = formData.name.trim().length > 0;
  const priceNum = Number(formData.price);
  const stockNum = Number(formData.stock);
  const priceValid =
    formData.price.trim() !== "" && Number.isFinite(priceNum) && priceNum >= 0;
  const stockValid =
    formData.stock.trim() !== "" &&
    Number.isInteger(stockNum) &&
    stockNum >= 0;
  const formValid = nameValid && priceValid && stockValid;

  function resetForm() {
    setFormData(emptyForm);
    setEditId(null);
    setSubmitAttempted(false);
    setTouched(false);
  }

  // Rewritten from scratch: add and edit are separate, each surfaces the REAL
  // error (status + message) so failures are never silent.
  async function handleAdd() {
    const body = {
      name: formData.name.trim(),
      category: formData.category,
      price: priceNum,
      stock: stockNum,
      status: deriveStatus(stockNum),
    };
    setSubmitting(true);
    try {
      const created = await create<Product>("products", body);
      setProducts((prev) => [...prev, created]);
      toast("Product added", "success");
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Products] add failed:", err);
      toast(`Failed to add product: ${msg}`, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!editId) return;
    const body: Product = {
      id: editId,
      name: formData.name.trim(),
      category: formData.category,
      price: priceNum,
      stock: stockNum,
      status: deriveStatus(stockNum),
    };
    setSubmitting(true);
    try {
      const updated = await update<Product>("products", editId, body);
      const next = updated && updated.id ? updated : body;
      setProducts((prev) => prev.map((p) => (p.id === editId ? next : p)));
      toast("Product updated", "success");
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Products] update failed:", err);
      toast(`Failed to update product: ${msg}`, "error");
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

  function handleEdit(product: Product) {
    const category = (CATEGORIES as readonly string[]).includes(
      product.category
    )
      ? (product.category as Category)
      : "Other";
    setFormData({
      name: product.name,
      category,
      price: String(product.price),
      stock: String(product.stock),
    });
    setEditId(product.id);
    setSubmitAttempted(false);
    setTouched(false);
  }

  async function handleDelete(id: string) {
    try {
      await remove("products", id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editId === id) resetForm();
      toast("Product deleted", "success");
    } catch {
      toast("Failed to delete product", "error");
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
      <h3 style={{ color: colors.text, margin: 0 }}>Products</h3>

      {/* Add / Edit form */}
      <Card title={editId ? "Edit product" : "Add new product"}>
        <div
          style={{
            display: "flex",
            gap: spacing.md,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Field label="Name" style={{ flex: 1, minWidth: 160 }}>
            <Input
              value={formData.name}
              placeholder="Product name"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Field>

          <Field label="Category" style={{ flex: 1, minWidth: 150 }}>
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Category,
                })
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Price" style={{ minWidth: 120 }}>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={formData.price}
              placeholder="0"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </Field>

          <Field label="Stock" style={{ minWidth: 110 }}>
            <Input
              type="number"
              min={0}
              step="1"
              value={formData.stock}
              placeholder="0"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
            />
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
            Name is required, and price and stock must be numbers of 0 or more.
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
              placeholder="Search by name"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>

          <Field label="Category" style={{ minWidth: 160 }}>
            <Select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as CategoryFilter)
              }
            >
              <option value="All">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
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
          <EmptyState message="No products found." />
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th style={{ ...thStyle, color: colors.cyan }}>Name</th>
                    <th style={{ ...thStyle, color: colors.purple }}>
                      Category
                    </th>
                    <th style={{ ...thStyle, color: colors.green }}>Price</th>
                    <th style={{ ...thStyle, color: colors.amber }}>Stock</th>
                    <th style={{ ...thStyle, color: colors.cyan }}>Status</th>
                    <th style={{ ...thStyle, color: colors.red }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((product) => (
                    <tr
                      key={product.id}
                      onMouseEnter={() => setHoveredRow(product.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor:
                          hoveredRow === product.id ? rowHoverBg : "transparent",
                        transition: `background-color ${transitions.fast}`,
                      }}
                    >
                      <td style={{ ...tdStyle, color: colors.text }}>
                        {product.name}
                      </td>
                      <td style={{ ...tdStyle, color: colors.muted }}>
                        {product.category}
                      </td>
                      <td style={{ ...tdStyle, color: colors.text }}>
                        {"$" + product.price.toLocaleString()}
                      </td>
                      <td style={{ ...tdStyle, color: colors.muted }}>
                        {product.stock}
                      </td>
                      <td style={tdStyle}>
                        <StatusPill status={product.status} />
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: spacing.sm }}>
                          <Button
                            variant="warning"
                            style={{ padding: "4px 12px", fontSize: 13 }}
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            style={{ padding: "4px 12px", fontSize: 13 }}
                            onClick={() => handleDelete(product.id)}
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

export default Products;
