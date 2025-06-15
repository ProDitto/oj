// src/pages/AuthPage.tsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signup, login } from '../api/endpoints';
import type { SignupPayload, LoginPayload } from '../types';
import { useNavigate } from 'react-router-dom';

type AuthPageProps = {
    getUserProfile: () => void
}

const AuthPage: React.FC<AuthPageProps> = ({ getUserProfile }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SignupPayload>();

    const onSubmit = async (data: SignupPayload) => {
        setServerError('');

        try {
            if (isSignup) {
                await signup(data);
                reset();
                setIsSignup(false);
            } else {
                const loginData: LoginPayload = {
                    Username: data.Username,
                    Password: data.Password,
                };
                await login(loginData);
                navigate('/problems');
            }
            getUserProfile();
        } catch (err) {
            console.log("Error: ", err)
            // setServerError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isSignup ? 'Create Account' : 'Log In'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            {...register('Username', { required: 'Username is required' })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                        />
                        {errors.Username && (
                            <p className="text-red-500 text-sm mt-1">{errors.Username.message}</p>
                        )}
                    </div>

                    {isSignup && (
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register('Email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: 'Invalid email format',
                                    },
                                })}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                            />
                            {errors.Email && (
                                <p className="text-red-500 text-sm mt-1">{errors.Email.message}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('Password', {
                                required: 'Password is required',
                                // minLength: {
                                //     value: 6,
                                //     message: 'Password must be at least 6 characters',
                                // },
                            })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
                        />
                        {errors.Password && (
                            <p className="text-red-500 text-sm mt-1">{errors.Password.message}</p>
                        )}
                    </div>

                    {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        {isSubmitting ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup);
                            reset();
                            setServerError('');
                        }}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {isSignup ? 'Log in' : 'Sign up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
