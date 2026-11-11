import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "../store";
import { Button, Loader, ProjectCard } from "../components";

export default function Projects() {
  const { state, addProject, updateProject, deleteProject } = useStore();
  const { projects, loaded } = state;

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const handleEdit = useCallback((project) => {
    setEditing(project);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Delete this project?")) deleteProject(id);
    },
    [deleteProject]
  );

  async function handleSubmit(values) {
    if (editing) {
      await updateProject(editing.id, values);
    } else {
      await addProject(values);
    }
    setFormOpen(false);
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          New project
        </Button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search projects…"
        className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
      />

      {!loaded ? (
        <Loader label="Loading projects" />
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
          No projects found. Create one to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {formOpen && (
        <ProjectForm
          initial={editing}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

// Kept in the same file since it's only used here — React Hook Form handles
// registration, validation errors, and submission.
function ProjectForm({ initial, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initial || { name: "", description: "", technology: "React", deadline: "", status: "Not Started" },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 dark:bg-slate-800"
      >
        <h2 className="text-lg font-semibold">{initial ? "Edit project" : "New project"}</h2>

        <div>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Project name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Description"
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            {...register("technology")}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          >
            {["React", "Node.js", "Python", ".NET", "Other"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            {...register("status")}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          >
            {["Not Started", "In Progress", "Completed"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <input
          type="date"
          {...register("deadline", { required: true })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
