import { useLocalStorage } from "../hooks";
import { Button } from "../components";

export default function Settings() {
  const [theme, setTheme] = useLocalStorage("devtrack-theme", "light");

  return (
    <div className="max-w-sm space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm font-medium">Theme</p>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Saved to this browser, so it stays after a refresh.</p>
        <div className="flex gap-2">
          <Button variant={theme === "light" ? "primary" : "secondary"} onClick={() => setTheme("light")}>
            Light
          </Button>
          <Button variant={theme === "dark" ? "primary" : "secondary"} onClick={() => setTheme("dark")}>
            Dark
          </Button>
        </div>
      </div>
    </div>
  );
}
