import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store";
import { StatCard, Loader, ProjectCard, TaskItem } from "../components";
import { completionRate } from "../utils";

export default function Dashboard() {
  const { state, updateTask, deleteTask } = useStore();
  const { projects, tasks, loaded } = state;

  const completed = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const rate = useMemo(() => completionRate(tasks), [tasks]);

  if (!loaded) return <Loader label="Loading dashboard" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Tasks" value={tasks.length} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Completion rate" value={`${rate}%`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-medium">Recent projects</h2>
            <Link to="/projects" className="text-sm text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} onEdit={() => {}} onDelete={() => {}} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-medium">Recent tasks</h2>
            <Link to="/tasks" className="text-sm text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 5).map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggle={(id) => updateTask(id, { completed: !t.completed })}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
