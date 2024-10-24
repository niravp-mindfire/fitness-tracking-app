// src/pages/Login.tsx
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
} from '../features/auth/auth';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../app/store'; // Import the AppDispatch type
import { LoginFormValues } from '../utils/types';
import { loginInitialValue } from '../utils/initialValues';
import { loginSchema } from '../utils/validationSchema'; // Import your validation schema
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { path } from '../utils/path';

const Login = () => {
  const dispatch: AppDispatch = useDispatch(); // Use AppDispatch type here
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const initialValues = useMemo(() => loginInitialValue, []);

  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      try {
        await dispatch(loginUser(values)).unwrap(); // Unwrap the result
        navigate('/dashboard'); // Redirect after successful login
      } catch (err) {
        // Handle login failure
        console.error('Login failed:', err); // Optionally log error
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
                        <div className="text-red-600 text-sm  ml-2">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={path.FORGET_PASSWORD}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot your password?
                  </Link>
                  <Link
                    to={path.REGISTER}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </Link>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                  {error && <div className="text-red-600 mt-2">{error}</div>}
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

export default React.memo(Login);
