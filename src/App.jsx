import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { StoreProvider } from "./store";
import { useLocalStorage } from "./hooks";
import { Loader } from "./components";

// Pages are lazy-loaded so the initial bundle stays small.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));

const LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
  { to: "/analytics", label: "Analytics" },
  { to: "/settings", label: "Settings" },
];

export default function App() {
  const [theme] = useLocalStorage("devtrack-theme", "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <StoreProvider>
      <nav className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-1 px-4 py-3">
          <span className="mr-4 font-semibold">DevTrack</span>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm ${
                  isActive ? "bg-brand text-white" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Suspense fallback={<Loader label="Loading page" />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </main>
    </StoreProvider>
  );
}
