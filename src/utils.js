// Small pure helpers, used inside useMemo so they only rerun when the
// underlying tasks/projects actually change.

export function completionRate(tasks) {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100);
}

export function groupByTechnology(projects) {
  return projects.reduce((acc, p) => {
    acc[p.technology] = (acc[p.technology] || 0) + 1;
    return acc;
  }, {});
}

export function taskStatusCounts(tasks) {
  return {
    Completed: tasks.filter((t) => t.completed).length,
    Pending: tasks.filter((t) => !t.completed).length,
  };
}
