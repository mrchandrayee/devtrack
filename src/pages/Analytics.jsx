import { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useStore } from "../store";
import { Loader, StatCard } from "../components";
import { completionRate, groupByTechnology, taskStatusCounts } from "../utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function Analytics() {
  const { state } = useStore();
  const { projects, tasks, loaded } = state;

  const rate = useMemo(() => completionRate(tasks), [tasks]);
  const byTech = useMemo(() => groupByTechnology(projects), [projects]);
  const byStatus = useMemo(() => taskStatusCounts(tasks), [tasks]);

  if (!loaded) return <Loader label="Loading analytics" />;

  const barData = {
    labels: Object.keys(byTech),
    datasets: [{ label: "Projects", data: Object.values(byTech), backgroundColor: "#4f46e5" }],
  };

  const doughnutData = {
    labels: Object.keys(byStatus),
    datasets: [{ data: Object.values(byStatus), backgroundColor: ["#22c55e", "#f59e0b"] }],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Tasks" value={tasks.length} />
        <StatCard label="Completion rate" value={`${rate}%`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-3 text-sm font-medium">Projects by technology</h2>
          <div style={{ height: "16rem" }}>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="mb-3 text-sm font-medium">Task status</h2>
          <div style={{ height: "16rem" }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
