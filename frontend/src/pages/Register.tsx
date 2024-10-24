import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  registerUser,
  selectAuthError,
  selectAuthLoading,
} from '../features/auth/auth';
import { useNavigate } from 'react-router-dom';
import { RegisterFormValues } from '../utils/types';
import { calculateAge } from '../utils/common';
import { registerSchema } from '../utils/validationSchema';
import { registerInitialValue } from '../utils/initialValues';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const initialValues = useMemo(() => registerInitialValue, []);

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      const age = calculateAge(values.profile.dob);
      const userData = {
        ...values,
        profile: {
          ...values.profile,
          age,
        },
      };

      try {
        await dispatch(registerUser(userData)).unwrap();
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
    [dispatch, navigate],
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#EBF2FA]">
        <div className="bg-white text-black w-full max-w-md p-8 space-y-8 rounded-lg shadow-xl">
          <h2 className="text-center text-3xl font-bold text-blue-800">
            Create a new account
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  {/* First Name Input */}
                  <div className="relative">
                    <label htmlFor="firstName" className="sr-only">
                      First Name
                    </label>
                    <Field
                      as="input"
                      id="firstName"
                      name="profile.firstName"
                      type="text"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      name="profile.firstName"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Last Name Input */}
                  <div className="relative">
                    <label htmlFor="lastName" className="sr-only">
                      Last Name
                    </label>
                    <Field
                      as="input"
                      id="lastName"
                      name="profile.lastName"
                      type="text"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      name="profile.lastName"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Username Input */}
                  <div className="relative">
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <Field
                      as="input"
                      id="username"
                      name="username"
                      type="text"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                      placeholder="Username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <label htmlFor="email" className="sr-only">
                      Email Address
                    </label>
                    <Field
                      as="input"
                      id="email"
                      name="email"
                      type="email"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                      placeholder="Email Address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <Field
                      as="input"
                      id="password"
                      name="password"
                      type="password"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                      placeholder="Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Date of Birth Input */}
                  <div className="relative">
                    <label htmlFor="dob" className="sr-only">
                      Date of Birth
                    </label>
                    <Field
                      as="input"
                      id="dob"
                      name="profile.dob"
                      type="date"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                    />
                    <ErrorMessage
                      name="profile.dob"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Gender Dropdown */}
                  <div className="relative">
                    <label htmlFor="gender" className="sr-only">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="profile.gender"
                      id="gender"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Field>
                    <ErrorMessage
                      name="profile.gender"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Height Input */}
                  <div className="relative">
                    <label htmlFor="height" className="sr-only">
                      Height (cm)
                    </label>
                    <Field
                      as="input"
                      id="height"
                      name="profile.height"
                      type="number"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                      placeholder="Height (cm)"
                    />
                    <ErrorMessage
                      name="profile.height"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Weight Input */}
                  <div className="relative">
                    <label htmlFor="weight" className="sr-only">
                      Weight (kg)
                    </label>
                    <Field
                      as="input"
                      id="weight"
                      name="profile.weight"
                      type="number"
                      disabled={isSubmitting}
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                      placeholder="Weight (kg)"
                    />
                    <ErrorMessage
                      name="profile.weight"
                      component="div"
                      className="text-red-600 text-sm ml-2"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Register{' '}
                      {loading && <span className="animate-spin">⏳</span>}
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-600 text-sm ml-2">{error}</div>
                  )}

                  {/* Login Link */}
                  <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
