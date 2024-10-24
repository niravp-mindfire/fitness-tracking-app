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
    dob: any;
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
  currentWorkout: any;
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
  data: any; // You might want to replace `any` with a more specific type for better type safety
  onSort: (field: string, order: 'asc' | 'desc') => void;
  onPageChange: (newPage: number) => void;
  totalCount: number;
  rowsPerPage: number;
  handleEdit: (id: any) => void;
  handleDelete: (id: any) => void;
  expandable?: boolean;
  expandedRows?: string[]; // Add this line to define expanded rows
  toggleRow?: (id: string) => void; // Add this line to define the toggle function
  renderExpandableRow?: (row: any) => JSX.Element; // Specify that this function returns a JSX element
  sortField?: string;
  sortOrder?: string;
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
  sets: number; // Number of sets
  reps: number; // Number of reps
  weight: number; // Weight in kg
}

export interface WorkoutExerciseState {
  workoutExercises: WorkoutExercise[]; // Array of workout exercises
  loading: boolean; // Loading state
  error: string | null; // Error message
  totalCount: number; // Total count for pagination
  currentWorkoutExercise: WorkoutExercise | null; // Currently selected workout exercise
  page: number; // Current page
  limit: number; // Items per page
  sort: string; // Sort field
  order: 'asc' | 'desc'; // Sort order
  search: string; // Search query
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
  workoutPlans: WorkoutPlan[]; // Array of workout plans
  loading: boolean; // Loading state for fetching data
  error: string | null; // Error message if something goes wrong
  totalCount: number; // Total count of workout plans (for pagination)
  currentWorkoutPlan: WorkoutPlan | null; // Current workout plan being viewed or edited
  page: number; // Current page for pagination
  limit: number; // Number of records per page
  sort: string; // Column to sort by
  order: 'asc' | 'desc'; // Sorting order
  search: string; // Search query
}
export interface FoodItem {
  foodId: string; // Represents the ID of the food item
  quantity: number | ''; // Quantity of the food item
}

export interface Meal {
  mealType: string; // Change from mealName to mealType as per your current implementation
  foodItems: Array<{
    foodId: string; // Assuming foodId represents the ID of the food item
    quantity: number; // Quantity should be a number
  }>;
}

export interface MealPlan {
  _id: string; // ID of the meal plan
  userId: string; // ID of the user associated with the meal plan
  title: string; // Title of the meal plan
  description?: string; // Optional description
  duration: number; // Duration in days
  meals: Array<Meal>; // Use the updated Meal interface
  createdAt: string; // Creation timestamp
  updatedAt: string; // Update timestamp
}

// Define a type for form input
export interface MealPlanFormValues {
  title: string; // Title of the meal plan
  description?: string; // Optional description
  duration: number | ''; // Duration in days
  meals: Meal[]; // Array of meals in the meal plan
}

export interface MealPlanState {
  mealPlans: MealPlan[]; // List of meal plans
  loading: boolean; // Loading state
  error: string | null; // Error message
  totalCount: number; // Total count of meal plans
  currentMealPlan: MealPlan | null; // Currently selected meal plan
  page: number; // Current page for pagination
  limit: number; // Limit of meal plans per page
  sort: string; // Current sort field
  order: 'asc' | 'desc'; // Sort order
  search: string; // Search query
}

// Nutrition type
export interface Nutrition {
  _id?: string;
  notes: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

// NutritionState type
export interface NutritionState {
  nutritionEntries: Nutrition[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentNutrition: Nutrition | null;
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
}

// NutritionMeal type
export interface NutritionMeal {
  _id: string; // Unique identifier for the nutrition meal
  mealType: string; // Name of the meal
  calories: number; // Total calories in the meal
  protein: number; // Protein content in grams
  carbs: number; // Carbohydrate content in grams
  fat: number; // Fat content in grams
  servingSize: string; // Serving size description (e.g., "1 cup", "100g")
  createdAt: string; // Date and time the meal was created
  updatedAt: string; // Date and time the meal was last updated
}

// NutritionMealState type
export interface NutritionMealState {
  nutritionMeals: NutritionMeal[]; // Array of nutrition meals
  loading: boolean; // Loading state for async actions
  error: string | null; // Error message (if any)
  totalCount: number; // Total number of nutrition meals for pagination
  currentNutritionMeal: NutritionMeal | null; // Currently selected nutrition meal for editing
  page: number; // Current page for pagination
  limit: number; // Limit of items per page
  sort: string; // Current sort field
  order: 'asc' | 'desc'; // Sort order
  search: string; // Search query for filtering meals
}

// types.ts

export interface ProgressTracking {
  _id: string; // Unique identifier for the progress tracking entry
  userId: string; // ID of the user associated with this progress tracking
  date: string; // Date of the progress tracking entry (ISO format or string)
  value: number; // Value being tracked (e.g., weight, reps, etc.)
  notes?: string; // Optional notes about this entry
  createdAt: string; // Timestamp for when the entry was created
  updatedAt: string; // Timestamp for when the entry was last updated
}

export interface ProgressTrackingState {
  progressTrackings: ProgressTracking[]; // Array of progress tracking entries
  loading: boolean; // Loading state for fetching progress trackings
  error: string | null; // Error message, if any
  totalCount: number; // Total count of progress tracking entries for pagination
  currentProgressTracking: ProgressTracking | null; // Currently selected progress tracking entry
  page: number; // Current page for pagination
  limit: number; // Number of entries per page
  sort: string; // Field by which to sort entries
  order: 'asc' | 'desc'; // Order of sorting
  search: string; // Search term for filtering entries
}

export interface DialogProps {
  open: boolean;
  onClose: (fetch: boolean) => void;
  id?: string;
}
