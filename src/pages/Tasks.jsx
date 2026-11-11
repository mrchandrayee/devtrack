import { useState, useMemo, useCallback } from "react";
import { useStore } from "../store";
import { Loader, TaskItem, Button } from "../components";

export default function Tasks() {
  const { state, addTask, updateTask, deleteTask } = useStore();
  const { projects, tasks, loaded } = state;

  // Controlled form via useState, as the brief's basic task input example.
  const [title, setTitle] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === "Completed") return t.completed;
      if (statusFilter === "Pending") return !t.completed;
      return true;
    });
  }, [tasks, statusFilter]);

  const projectName = (id) => projects.find((p) => p.id === id)?.name;

  const handleToggle = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id);
      if (task) updateTask(id, { completed: !task.completed });
    },
    [tasks, updateTask]
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || projects.length === 0) return;
    addTask({ title: title.trim(), priority: "Medium", projectId: projects[0].id });
    setTitle("");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task…"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <Button type="submit">Add</Button>
      </form>

      <div className="flex gap-1 rounded-md border border-slate-300 p-1 dark:border-slate-600 w-fit">
        {["All", "Completed", "Pending"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded px-3 py-1 text-sm ${
              statusFilter === s ? "bg-brand text-white" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {!loaded ? (
        <Loader label="Loading tasks" />
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
          No tasks match this filter.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <TaskItem key={t.id} task={t} projectName={projectName(t.projectId)} onToggle={handleToggle} onDelete={deleteTask} />
          ))}
        </div>
      )}
    </div>
  );
}
