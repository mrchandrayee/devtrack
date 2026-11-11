import { createContext, useContext, useEffect, useReducer, useCallback } from "react";

// ---------------------------------------------------------------------------
// Mock "database". In a real app these would live on a server, and the
// functions below would be Axios calls instead of local array edits.
// ---------------------------------------------------------------------------
let projectsDB = [
  { id: 1, name: "Nimbus CRM", description: "A lightweight CRM for small sales teams.", technology: "React", progress: 72, deadline: "2026-10-15", status: "In Progress" },
  { id: 2, name: "Pixel Forge API", description: "Image processing microservice with caching.", technology: "Node.js", progress: 100, deadline: "2026-06-01", status: "Completed" },
  { id: 3, name: "Ledgerline", description: "Personal finance tracker with budget rollups.", technology: "Python", progress: 35, deadline: "2026-12-20", status: "In Progress" },
];

let tasksDB = [
  { id: 1, title: "Wire up OAuth login", completed: true, priority: "High", projectId: 1 },
  { id: 2, title: "Add pipeline drag-and-drop", completed: false, priority: "High", projectId: 1 },
  { id: 3, title: "Write CSV export tests", completed: false, priority: "Low", projectId: 1 },
  { id: 4, title: "Set up image resize queue", completed: true, priority: "Medium", projectId: 2 },
  { id: 5, title: "Build monthly rollup job", completed: false, priority: "High", projectId: 3 },
  { id: 6, title: "Design budget chart", completed: true, priority: "Low", projectId: 3 },
];

let nextProjectId = 4;
let nextTaskId = 7;

// A small delay so loading states are actually visible, like a real request.
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 300));

export const api = {
  getProjects: () => delay([...projectsDB]),
  getProject: (id) => delay(projectsDB.find((p) => p.id === id)),
  addProject: (data) => {
    const project = { id: nextProjectId++, progress: 0, ...data };
    projectsDB.push(project);
    return delay(project);
  },
  updateProject: (id, data) => {
    projectsDB = projectsDB.map((p) => (p.id === id ? { ...p, ...data } : p));
    return delay(projectsDB.find((p) => p.id === id));
  },
  deleteProject: (id) => {
    projectsDB = projectsDB.filter((p) => p.id !== id);
    tasksDB = tasksDB.filter((t) => t.projectId !== id);
    return delay(true);
  },
  getTasks: () => delay([...tasksDB]),
  addTask: (data) => {
    const task = { id: nextTaskId++, completed: false, ...data };
    tasksDB.push(task);
    return delay(task);
  },
  updateTask: (id, data) => {
    tasksDB = tasksDB.map((t) => (t.id === id ? { ...t, ...data } : t));
    return delay(tasksDB.find((t) => t.id === id));
  },
  deleteTask: (id) => {
    tasksDB = tasksDB.filter((t) => t.id !== id);
    return delay(true);
  },
};

// ---------------------------------------------------------------------------
// Reducer — one place that knows how the shared state changes.
// ---------------------------------------------------------------------------
const initialState = { projects: [], tasks: [], loaded: false };

function reducer(state, action) {
  switch (action.type) {
    case "LOADED":
      return { ...state, projects: action.projects, tasks: action.tasks, loaded: true };
    case "ADD_PROJECT":
      return { ...state, projects: [action.payload, ...state.projects] };
    case "UPDATE_PROJECT":
      return { ...state, projects: state.projects.map((p) => (p.id === action.payload.id ? action.payload : p)) };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        tasks: state.tasks.filter((t) => t.projectId !== action.id),
      };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)) };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context — makes the state + actions available to every page without
// passing props down through the router.
// ---------------------------------------------------------------------------
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([api.getProjects(), api.getTasks()]).then(([projects, tasks]) => {
      dispatch({ type: "LOADED", projects, tasks });
    });
  }, []);

  const addProject = useCallback(async (data) => {
    const project = await api.addProject(data);
    dispatch({ type: "ADD_PROJECT", payload: project });
  }, []);

  const updateProject = useCallback(async (id, data) => {
    const project = await api.updateProject(id, data);
    dispatch({ type: "UPDATE_PROJECT", payload: project });
  }, []);

  const deleteProject = useCallback(async (id) => {
    await api.deleteProject(id);
    dispatch({ type: "DELETE_PROJECT", id });
  }, []);

  const addTask = useCallback(async (data) => {
    const task = await api.addTask(data);
    dispatch({ type: "ADD_TASK", payload: task });
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const task = await api.updateTask(id, data);
    dispatch({ type: "UPDATE_TASK", payload: task });
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api.deleteTask(id);
    dispatch({ type: "DELETE_TASK", id });
  }, []);

  const value = { state, addProject, updateProject, deleteProject, addTask, updateTask, deleteTask };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
