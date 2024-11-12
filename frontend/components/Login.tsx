'use client';
import React, { useCallback, useMemo } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Link from 'next/link';
import { loginInitialValue } from '@/utils/initialValues';
import { LoginFormValues } from '@/interfaces/interfaces';
import Navbar from '@/components/LandingPage/Navbar';
import { loginSchema } from '@/utils/validationSchema';
import { path } from '@/utils/path';
import Footer from '@/components/LandingPage/Footer';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Login = () => {
  const router = useRouter();
  const initialValues = useMemo(() => loginInitialValue, []);
  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        const response = await axiosInstance.post(apiUrl.LOGIN, values);
        if (response && response?.status == 200) {
          localStorage.setItem('token', response?.data?.data?.token);
          localStorage.setItem(
            'refreshToken',
            response?.data?.data?.refreshToken,
          );
          localStorage.setItem('role', response?.data?.data?.role);
          Cookies.set('authToken', response?.data?.data?.token, {
            expires: 1,
            secure: true,
          });
          router.push(path.DASHBOARD);
        } else {
          toast.error('Something went wrong, Please try again');
        }
      } catch (error: any) {
        console.log(error);

        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            'Registration failed',
        );
      }
    },
    [router],
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#EBF2FA]">
        <div className="bg-white text-black w-full max-w-md p-8 space-y-8 rounded-lg shadow-xl">
          <h2 className="text-center text-3xl font-bold text-blue-800">
            Sign in to your account
          </h2>
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema} // Set validation schema here
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="relative">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
                      placeholder="Email address"
                    />
                    <ErrorMessage name="email">
                      {(msg) => (
                        <div className="text-red-600 text-sm ml-2">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="appearance-none rounded-md block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm"
                      placeholder="Password"
                    />
                    <ErrorMessage name="password">
                      {(msg) => (
                        <div className="text-red-600 text-sm ml-2">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href={path.FORGET_PASSWORD}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot your password?
                  </Link>
                  <Link
                    href={path.REGISTER}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </Link>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
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

export default Login;
