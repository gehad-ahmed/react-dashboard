import { useEffect, useMemo, useState } from "react";
import type { Client } from "../types.ts";
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

type ClientStatus = Client["status"];
type StatusFilter = "All" | ClientStatus;

interface FormData {
  name: string;
  industry: string;
  status: ClientStatus;
}

const emptyForm: FormData = { name: "", industry: "", status: "Active" };

const PAGE_SIZE = 5;

function Clients() {
  const { toast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
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
      const data = await getAll<Client>("clients");
      setClients(data);
    } catch {
      setError("Failed to load clients.");
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
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      const matchesSearch =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const nameValid = formData.name.trim().length > 0;
  const industryValid = formData.industry.trim().length > 0;
  const formValid = nameValid && industryValid;

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
      industry: formData.industry.trim(),
      status: formData.status,
    };
    setSubmitting(true);
    try {
      const created = await create<Client>("clients", body);
      setClients((prev) => [...prev, created]);
      toast("Client added", "success");
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Clients] add failed:", err);
      toast(`Failed to add client: ${msg}`, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!editId) return;
    const body: Client = {
      id: editId,
      name: formData.name.trim(),
      industry: formData.industry.trim(),
      status: formData.status,
    };
    setSubmitting(true);
    try {
      const updated = await update<Client>("clients", editId, body);
      // Trust the server's response; fall back to our body if it returns nothing.
      const next = updated && updated.id ? updated : body;
      setClients((prev) => prev.map((c) => (c.id === editId ? next : c)));
      toast("Client updated", "success");
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Clients] update failed:", err);
      toast(`Failed to update client: ${msg}`, "error");
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

  function handleEdit(client: Client) {
    setFormData({
      name: client.name,
      industry: client.industry,
      status: client.status,
    });
    setEditId(client.id);
    setSubmitAttempted(false);
    setTouched(false);
  }

  async function handleDelete(id: string) {
    try {
      await remove("clients", id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      if (editId === id) resetForm();
      toast("Client deleted", "success");
    } catch {
      toast("Failed to delete client", "error");
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
      <h3 style={{ color: colors.text, margin: 0 }}>Clients</h3>

      {/* Add / Edit form */}
      <Card title={editId ? "Edit client" : "Add new client"}>
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
              placeholder="Client name"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Field>

          <Field label="Industry" style={{ flex: 1, minWidth: 160 }}>
            <Input
              value={formData.industry}
              placeholder="Industry"
              onBlur={() => setTouched(true)}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
            />
          </Field>

          <Field label="Status" style={{ flex: 1, minWidth: 140 }}>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ClientStatus,
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
          <p style={{ color: colors.red, fontSize: 13, margin: 0, marginTop: spacing.md }}>
            Name and industry are required.
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
              placeholder="Search by name or industry"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>

          <Field label="Status" style={{ minWidth: 160 }}>
            <Select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilter)
              }
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </Field>
        </div>

        {loading ? (
          <SkeletonTable rows={PAGE_SIZE} columns={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState message="No clients found." />
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th style={{ ...thStyle, color: colors.cyan }}>Name</th>
                    <th style={{ ...thStyle, color: colors.purple }}>
                      Industry
                    </th>
                    <th style={{ ...thStyle, color: colors.green }}>Status</th>
                    <th style={{ ...thStyle, color: colors.amber }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((client) => (
                    <tr
                      key={client.id}
                      onMouseEnter={() => setHoveredRow(client.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        backgroundColor:
                          hoveredRow === client.id ? rowHoverBg : "transparent",
                        transition: `background-color ${transitions.fast}`,
                      }}
                    >
                      <td style={{ ...tdStyle, color: colors.text }}>
                        {client.name}
                      </td>
                      <td style={{ ...tdStyle, color: colors.muted }}>
                        {client.industry}
                      </td>
                      <td style={tdStyle}>
                        <StatusPill status={client.status} />
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: spacing.sm }}>
                          <Button
                            variant="warning"
                            style={{ padding: "4px 12px", fontSize: 13 }}
                            onClick={() => handleEdit(client)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            style={{ padding: "4px 12px", fontSize: 13 }}
                            onClick={() => handleDelete(client.id)}
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

export default Clients;
