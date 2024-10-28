// src/pages/ForgetPassword.tsx
import React, { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  forgetPassword as forgetPasswordAction,
  selectAuthError,
  selectAuthLoading,
} from '../features/auth/auth';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import { ForgetPasswordFormValues } from '../utils/types';
import { forgetPasswordSchema } from '../utils/validationSchema';
import { forgetPasswordInitialValue } from '../utils/initialValues';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { seo } from '../utils/seo';

const ForgetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter(); // Use useRouter for navigation
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const initialValues = useMemo(() => forgetPasswordInitialValue, []);

  const handleSubmit = useCallback(
    async (values: ForgetPasswordFormValues) => {
      try {
        await dispatch(forgetPasswordAction(values)).unwrap();
        toast.success(
          'If an account with that email address exists, you will receive an email with a link to reset your password.',
        );

        // Optional: Navigate to a different page after successful submission
        // router.push('/success'); // Adjust this as needed
      } catch (error) {
        toast.error('Failed to send password reset link.');
        console.error('Forget password request failed:', error);
      }
    },
    [dispatch],
  );

  return (
    <>
      <SEO
        title={seo?.forgotPassword?.title}
        description={seo?.forgotPassword?.description}
        keywords={seo?.forgotPassword?.keywords?.join(',')}
      />
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

                    {/* Error Message */}
                    {error && (
                      <div className="text-red-600 text-sm ml-2">{error}</div>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default React.memo(ForgetPassword);
