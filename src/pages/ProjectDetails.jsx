import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore, api } from "../store";
import { Loader, ErrorMessage, Button, TaskItem } from "../components";

export default function ProjectDetails() {
  const { id } = useParams();
  const projectId = Number(id);

  // Fetched directly here (rather than from the shared store) to show the
  // plain useEffect + useState + loading/error pattern driven by useParams.
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .getProject(projectId)
      .then((data) => (data ? setProject(data) : setError("Project not found.")))
      .catch(() => setError("Could not load this project."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const { state, addTask, updateTask, deleteTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const projectTasks = useMemo(() => state.tasks.filter((t) => t.projectId === projectId), [state.tasks, projectId]);

  function handleAddTask(e) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle.trim(), priority: "Medium", projectId });
    setNewTaskTitle("");
  }

  if (loading) return <Loader label="Loading project" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="text-sm text-slate-500 hover:text-brand">
        ← Back to projects
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{project.description}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {project.technology} · Due {project.deadline} · {project.status}
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-medium">Tasks</h2>

        <form onSubmit={handleAddTask} className="mb-3 flex gap-2">
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a task…"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
          <Button type="submit">Add</Button>
        </form>

        {projectTasks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No tasks yet.</p>
        ) : (
          <div className="space-y-2">
            {projectTasks.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={(taskId) => updateTask(taskId, { completed: !t.completed })}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
