'use client';
import React, { useCallback, useMemo } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Navbar from '@/components/LandingPage/Navbar';
import { path } from '@/utils/path';
import Footer from '@/components/LandingPage/Footer';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@/utils/validationSchema';

const ResetPassword = ({ token }: any) => {
  const router = useRouter();
  if (!token) {
    // Optionally show an error if there's no token
    router.push(path.HOME); // Redirect to home or show a token error page
  }

  const initialValues = useMemo(
    () => ({ password: '', confirmPassword: '' }),
    [],
  );

  const handleSubmit = useCallback(
    async (values: any) => {
      try {
        if (token) {
          const response = await axiosInstance.post(
            apiUrl.RESET_PASSWORD + `/${token}`,
            {
              password: values.password,
            },
          );

          if (response && response?.status === 200) {
            toast.success('Password reset successful');
            router.push(path.LOGIN); // Redirect to login page after successful reset
          } else {
            toast.error('Something went wrong. Please try again');
          }
        } else {
          router.push(path.HOME);
        }
      } catch (error: any) {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Password reset failed',
        );
      }
    },
    [router, token],
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#EBF2FA]">
        <div className="bg-white text-black w-full max-w-md p-8 space-y-8 rounded-lg shadow-xl">
          <h2 className="text-center text-3xl font-bold text-blue-800">
            Reset Password
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={resetPasswordSchema} // Use reset password schema
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  {/* Password Input */}
                  <div className="relative">
                    <label htmlFor="password" className="sr-only">
                      New Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
                      placeholder="New Password"
                    />
                    <ErrorMessage name="password">
                      {(msg) => (
                        <div className="text-red-600 text-sm ml-2">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage name="confirmPassword">
                      {(msg) => (
                        <div className="text-red-600 text-sm ml-2">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
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

export default ResetPassword;
