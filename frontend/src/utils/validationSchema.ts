import * as Yup from 'yup';
// Validation schema for the registration form
export const registerSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  profile: Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    dob: Yup.date().required('Date of Birth is required'), // Validation for dob
    gender: Yup.string().required('Gender is required'),
    height: Yup.number().required('Height is required').positive(),
    weight: Yup.number().required('Weight is required').positive(),
  }),
});

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const forgetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export const updateProfileSchema = Yup.object().shape({
  profile: Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    age: Yup.number().required('Age is required'),
    gender: Yup.string().required('Gender is required'),
    height: Yup.number().required('Height is required'),
    weight: Yup.number().required('Weight is required'),
  }),
  fitnessGoals: Yup.array().of(
    Yup.object().shape({
      goalType: Yup.string().required('Goal Type is required'),
      targetValue: Yup.number().required('Target Value is required'),
      currentValue: Yup.number().required('Current Value is required'),
      targetDate: Yup.date().required('Target Date is required').nullable(),
    })
  )
});
export const ExerciseSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  type: Yup.string().required('Type is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
});

export const WorkoutPlanSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  duration: Yup.number()
    .required("Duration is required")
    .positive("Duration must be a positive number"),
  exercises: Yup.array()
    .of(
      Yup.object({
        exerciseId: Yup.string().required("Exercise is required"),
        sets: Yup.number()
          .required("Sets are required")
          .min(1, "Sets must be at least 1"),
        reps: Yup.number()
          .required("Reps are required")
          .min(1, "Reps must be at least 1"),
      })
    )
    .min(1, "At least one exercise must be added"),
});