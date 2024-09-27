// src/app/types.ts

export interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    token: string | null;
}

export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    profile: {
        firstName: string;
        lastName: string;
        age: number; // This will be calculated
        gender: string;
        height: number;
        weight: number;
        dob: string; // New field for date of birth
    };
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface ForgetPasswordFormValues {
    email: string;
}

// types.ts
export interface ProfileFormValues {
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        gender: string;
        height: number;
        weight: number;
        dob: any
    };
    fitnessGoals: any;
}
export interface Workout {
    _id: number;
    date: string;
    duration: string;
    notes: string;
  }
  
  export interface WorkoutState {
    workouts: Workout[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    page: number;
    limit: number;
    sort: string;
    order: 'asc' | 'desc';
    search: string;
    currentWorkout: any
  }
  
  export interface TableRowData {
    id: number;
    date: string;
    duration: string;
    notes: string;
  }
  
  export interface TableColumn {
    field: string;
    headerName: string;
    sorting: boolean;
  }
  
  export interface DataTableProps {
    columns: TableColumn[];
    data: TableRowData[];
    onSort: (field: string, order: 'asc' | 'desc') => void;
    onPageChange: (newPage: number) => void;
    totalCount: number;
    rowsPerPage: number;
    handleEdit: (id: any) => void,
    handleDelete: (id: any) => void
  }
  