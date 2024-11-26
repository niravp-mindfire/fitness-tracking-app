'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Link from 'next/link';
import { loginInitialValue } from '@/utils/initialValues';
import { LoginFormValues } from '@/interfaces/interfaces';
import Navbar from '@/components/LandingPage/Navbar';
import { forgetPasswordSchema, loginSchema } from '@/utils/validationSchema';
import { path } from '@/utils/path';
import Footer from '@/components/LandingPage/Footer';
import axiosInstance from '@/utils/axiosInstance';
import { apiUrl } from '@/utils/apiUrl';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const initialValues = useMemo(() => loginInitialValue, []);
  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        setLoading(true);
        const response = await axiosInstance.post(
          apiUrl.FORGET_PASSWORD,
          values,
        );
        if (response && response?.status == 200) {
          setLoading(false);
          router.push(path.HOME);
        } else {
          setLoading(false);
          toast.error('Something went wrong, Please try again');
        }
      } catch (error: any) {
        console.log(error);
        setLoading(false);
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
            Forgot Password
          </h2>
          <h4 className="text-center font-bold text-blue-800">
            Enter your email address and we'll send you a link to reset your
            password.
          </h4>
          <Formik
            initialValues={initialValues}
            validationSchema={forgetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
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
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Send Reset Link
                      {loading && <span className="animate-spin">⏳</span>}
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

export default Login;
