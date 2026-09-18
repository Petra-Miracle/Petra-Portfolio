"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import type { Technology, TechnologyCategory } from "@/lib/types";
import {
  createTechnology,
  deleteTechnology,
  getTechnologies,
  handleUnauthorized,
  isUnauthorized,
  updateTechnology,
} from "@/lib/admin-api";
import {
  Badge,
  EmptyState,
  ErrorBanner,
  Field,
  IconButton,
  Modal,
  OutlineButton,
  PageHeader,
  PrimaryButton,
  SegmentedControl,
  TextInput,
} from "@/components/admin/ui";

interface TechnologiesManagerProps {
  token: string;
}

const EMPTY_FORM = {
  name: "",
  category: "GENERAL" as TechnologyCategory,
  icon: "",
  order: "",
};

export function TechnologiesManager({ token }: TechnologiesManagerProps) {
  const [items, setItems] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    const data = await getTechnologies(token);
    return [...data].sort(
      (a, b) => a.order - b.order || a.name.localeCompare(b.name),
    );
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    loadItems()
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (isUnauthorized(err)) {
          handleUnauthorized();
          return;
        }
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadItems]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setModalOpen(true);
  }

  function openEdit(tech: Technology) {
    setEditingId(tech.id);
    setForm({
      name: tech.name,
      category: tech.category,
      icon: tech.icon ?? "",
      order: String(tech.order),
    });
    setSubmitError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setSubmitError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSubmitError(null);
    const body = {
      name: form.name.trim(),
      category: form.category,
      icon: form.icon.trim() === "" ? null : form.icon.trim(),
      order: form.order.trim() === "" ? undefined : Number(form.order),
    };
    try {
      if (editingId) {
        await updateTechnology(token, editingId, body);
      } else {
        await createTechnology(token, body);
      }
      setModalOpen(false);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      setSubmitError(
        err instanceof Error ? err.message : "Gagal menyimpan data.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Hapus teknologi ini?")) return;
    try {
      await deleteTechnology(token, id);
      setItems(await loadItems());
    } catch (err) {
      if (isUnauthorized(err)) {
        handleUnauthorized();
        return;
      }
      window.alert(
        err instanceof Error ? err.message : "Gagal menghapus data.",
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Teknologi"
        subtitle="Kelola daftar teknologi yang ditampilkan di halaman publik."
        action={
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} />
            Tambah
          </PrimaryButton>
        }
      />

      {error ? (
        <div className="mb-6">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      ) : null}

      {/* ---- Tabel ---- */}
      {!loading && items.length > 0 ? (
        <div className="hidden overflow-hidden rounded-[14px] border border-border sm:block">
          <table className="w-full text-left">
            <thead className="border-b border-border bg-surface">
              <tr>
                <Th>Nama</Th>
                <Th>Kategori</Th>
                <Th className="text-center">Urutan</Th>
                <Th className="text-right">Aksi</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((tech) => (
                <tr key={tech.id} className="transition-colors hover:bg-surface-alt/60">
                  <td className="px-5 py-[14px] text-sm font-medium text-foreground">
                    {tech.name}
                  </td>
                  <td className="px-5 py-[14px]">
                    <Badge variant={tech.category === "AI" ? "ai" : "general"}>{tech.category}</Badge>
                  </td>
                  <td className="px-5 py-[14px] text-center text-sm text-muted">
                    {tech.order}
                  </td>
                  <td className="px-5 py-[14px]">
                    <div className="flex justify-end gap-2">
                      <IconButton label="Edit" onClick={() => openEdit(tech)}>
                        <Pencil size={15} />
                      </IconButton>
                      <IconButton
                        label="Hapus"
                        variant="danger"
                        onClick={() => handleDelete(tech.id)}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : loading ? (
        <div className="card hidden p-8 text-center text-sm text-muted sm:block">
          Memuat data...
        </div>
      ) : null}

      {/* ---- Mobile list ---- */}
      <div className="space-y-3 sm:hidden">
        {loading ? (
          <div className="card p-8 text-center text-sm text-muted">Memuat data...</div>
        ) : items.length > 0 ? (
          items.map((tech) => (
            <div key={tech.id} className="card flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{tech.name}</p>
                <div className="mt-1.5">
                  <Badge variant={tech.category === "AI" ? "ai" : "general"}>{tech.category}</Badge>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <IconButton label="Edit" onClick={() => openEdit(tech)}>
                  <Pencil size={15} />
                </IconButton>
                <IconButton
                  label="Hapus"
                  variant="danger"
                  onClick={() => handleDelete(tech.id)}
                >
                  <Trash2 size={15} />
                </IconButton>
              </div>
            </div>
          ))
        ) : null}
      </div>

      {/* ---- Empty state (tabel kosong) ---- */}
      {!loading && items.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Layers size={22} />}
            title="Belum ada data teknologi."
            description="Data teknologi Anda akan tampil di sini setelah ditambahkan."
            action={
              <PrimaryButton onClick={openCreate}>
                <Plus size={16} />
                Tambah Teknologi
              </PrimaryButton>
            }
          />
        </div>
      )}

      {/* ---- Modal form ---- */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Teknologi" : "Tambah Teknologi"}
        footer={
          <>
            <OutlineButton onClick={closeModal}>Batal</OutlineButton>
            <PrimaryButton form="technology-form" type="submit" loading={saving}>
              {editingId ? "Simpan Perubahan" : "Simpan"}
            </PrimaryButton>
          </>
        }
      >
        {submitError ? (
          <div className="mb-4">
            <ErrorBanner>{submitError}</ErrorBanner>
          </div>
        ) : null}

        <form id="technology-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama *" className="sm:col-span-2">
              <TextInput
                required
                autoFocus
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="cth: React"
              />
            </Field>

            <Field label="Kategori" className="sm:col-span-2">
              <SegmentedControl
                value={form.category}
                onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                options={[
                  { value: "GENERAL", label: "GENERAL" },
                  { value: "AI", label: "AI" },
                ]}
              />
            </Field>

            <Field label="Urutan">
              <TextInput
                type="number"
                inputMode="numeric"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                placeholder="0"
              />
            </Field>
          </div>

          <Field label="Icon (opsional)" hint="Nama icon atau URL gambar.">
            <TextInput
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="cth: globe"
            />
          </Field>
        </form>
      </Modal>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-[14px] font-mono text-[11px] font-semibold uppercase tracking-wider text-muted ${className}`}
      style={{ fontFamily: "var(--font-mono-jb)" }}
    >
      {children}
    </th>
  );
}