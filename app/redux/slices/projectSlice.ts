// app/redux/slices/projectSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate?: string;
  assignedTo: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  budget?: number;
  tags?: string[];
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    search?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      if (state.selectedProject?.id === action.payload.id) {
        state.selectedProject = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (state.selectedProject?.id === action.payload) {
        state.selectedProject = null;
      }
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProjectState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPagination: (state, action: PayloadAction<Partial<ProjectState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearProjects: (state) => {
      state.projects = [];
      state.selectedProject = null;
      state.error = null;
      state.filters = {};
      state.pagination = initialState.pagination;
    },
  },
});

export const {
  setLoading,
  setError,
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setSelectedProject,
  setFilters,
  clearFilters,
  setPagination,
  clearProjects,
} = projectSlice.actions;

export default projectSlice.reducer;