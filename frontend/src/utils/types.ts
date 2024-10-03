// src/app/types.ts

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  role: string | null;
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
  data: any;
  onSort: (field: string, order: 'asc' | 'desc') => void;
  onPageChange: (newPage: number) => void;
  totalCount: number;
  rowsPerPage: number;
  handleEdit: (id: any) => void,
  handleDelete: (id: any) => void
}

export interface Exercise {
  _id?: string;
  name: string;
  type: string;
  description: string;
  category: string;
}

export interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentExercise: Exercise | null;
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
}

export interface WorkoutExercise {
  id?: string; // Optional for when fetching from API
  workoutId: string; // Reference to the workout
  exerciseId: string; // Reference to the exercise
  sets: number;      // Number of sets
  reps: number;      // Number of reps
  weight: number;    // Weight in kg
}

export interface WorkoutExerciseState {
  workoutExercises: WorkoutExercise[]; // Array of workout exercises
  loading: boolean;                     // Loading state
  error: string | null;                 // Error message
  totalCount: number;                   // Total count for pagination
  currentWorkoutExercise: WorkoutExercise | null; // Currently selected workout exercise
  page: number;                         // Current page
  limit: number;                        // Items per page
  sort: string;                         // Sort field
  order: 'asc' | 'desc';                // Sort order
  search: string;                       // Search query
}

// WorkoutPlan type
interface ExerciseEntry {
  exerciseId: string;
  sets: number;
  reps: number;
}

export interface WorkoutPlan {
  _id?: string; // Optional if you're creating a new workout plan
  title: string;
  description: string;
  duration: number;
  exercises: ExerciseEntry[]; // Ensure this property is included
}
// WorkoutPlanState type
export interface WorkoutPlanState {
  workoutPlans: WorkoutPlan[];    // Array of workout plans
  loading: boolean;               // Loading state for fetching data
  error: string | null;           // Error message if something goes wrong
  totalCount: number;             // Total count of workout plans (for pagination)
  currentWorkoutPlan: WorkoutPlan | null; // Current workout plan being viewed or edited
  page: number;                   // Current page for pagination
  limit: number;                  // Number of records per page
  sort: string;                   // Column to sort by
  order: 'asc' | 'desc';          // Sorting order
  search: string;                 // Search query
}
