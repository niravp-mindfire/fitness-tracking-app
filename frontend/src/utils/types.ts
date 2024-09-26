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
  

