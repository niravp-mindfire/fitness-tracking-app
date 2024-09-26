import { ProfileFormValues } from "./types";

export const registerInitialValue = {
    username: '',
    email: '',
    password: '',
    profile: {
        firstName: '',
        lastName: '',
        age: 0, // Initial value will be updated
        gender: '', // Initial value for gender
        height: 0,
        weight: 0,
        dob: '', // Initial value for date of birth
    },
}

export const loginInitialValue = {
    email: '',
    password: '',
}

export const forgetPasswordInitialValue = {
    email: '',
};

export const updateProfileInitialValues = (userProfile: any): ProfileFormValues => {
  if (!userProfile) return {
    profile: { firstName: '', lastName: '', dob: '', age: 0, gender: '', height: 0, weight: 0 },
    fitnessGoals: [],
  };

  return {
    profile: {
      firstName: userProfile?.profile?.firstName || '',
      lastName: userProfile?.profile?.lastName || '',
      dob: userProfile?.profile?.dob || '',
      age: userProfile?.profile?.age || 0,
      gender: userProfile?.profile?.gender || '',
      height: userProfile?.profile?.height || 0,
      weight: userProfile?.profile?.weight || 0,
    },
    fitnessGoals: userProfile?.fitnessGoals || [{
      goalType: '',
      targetValue: 0,
      currentValue: 0,
      targetDate: '',
    }],
  };
};
