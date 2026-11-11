import { memo } from "react";
import { Link } from "react-router-dom";

export function Button({ children, variant = "primary", className = "", ...rest }) {
  const styles =
    variant === "primary"
      ? "bg-brand hover:bg-brand-hover text-white"
      : variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100";

  return (
    <button
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${styles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Loader({ label = "Loading" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-slate-500 dark:text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
      {message}
    </div>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

const STATUS_COLORS = {
  "Not Started": "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

// Wrapped in memo since Projects.jsx renders many of these from a list and
// only the edited/deleted card should actually re-render.
export const ProjectCard = memo(function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/projects/${project.id}`} className="font-semibold hover:text-brand">
          {project.name}
        </Link>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[project.status]}`}>
          {project.status}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {project.technology} · Due {project.deadline}
      </p>
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-full rounded-full bg-brand" style={{ width: `${project.progress}%` }} />
      </div>
      <div className="mt-3 flex gap-2">
        <Link to={`/projects/${project.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            View
          </Button>
        </Link>
        <Button variant="secondary" onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(project.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
});

const PRIORITY_COLORS = {
  High: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

// Also memoized — Tasks.jsx can have a long list and toggling one checkbox
// shouldn't re-render every other row.
export const TaskItem = memo(function TaskItem({ task, onToggle, onDelete, projectName }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="h-4 w-4 accent-brand" />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${task.completed ? "text-slate-400 line-through" : ""}`}>{task.title}</p>
        {projectName && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{projectName}</p>}
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${PRIORITY_COLORS[task.priority]}`}>
        {task.priority}
      </span>
      <button onClick={() => onDelete(task.id)} className="text-xs text-slate-400 hover:text-red-500">
        Delete
      </button>
    </div>
  );
});
