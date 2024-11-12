'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { RegisterFormValues } from '../interfaces/interfaces';
import { registerSchema } from '../utils/validationSchema';
import { registerInitialValue } from '../utils/initialValues';
import Navbar from './LandingPage/Navbar';
import Footer from './LandingPage/Footer';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';
import { path } from '@/utils/path';
import { redirect } from 'next/navigation';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const initialValues = useMemo(() => registerInitialValue, []);

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      const age = 0;
      const userData = {
        ...values,
        profile: {
          ...values.profile,
          age,
        },
      };

      try {
        const response = await axiosInstance.post(apiUrl.REGISTER, userData);
        if (response && response?.status == 201) {
          toast.success(response.data.message);
          redirect(path.LOGIN);
        } else {
          toast.error('Something went wrong, Please try again');
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Registration failed',
        );
      }
    },
    [], // Update dependency
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
            {({ isSubmitting }) => (
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
                      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting && 'opacity-50'
                      }`}
                    >
                      {loading ? 'Creating...' : 'Register'}
                    </button>
                  </div>
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
