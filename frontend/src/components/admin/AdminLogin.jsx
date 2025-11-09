import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api';


/**
 * AdminLogin.jsx
 * Admin login page component using Tailwind CSS (indigo & cyan theme)
 *
 * Place this file at: /home/kalpix/meet-a-vet/frontend/src/components/admin/AdminLogin.jsx
 *
 * Note: Replace the placeholder fetch call with your real auth endpoint.
 */

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validate = () => {
        if (!email.trim()) return "Email is required";
        // simple email check
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) return "Enter a valid email";
        if (!password) return "Password is required";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        const loginData = {
            email,
            password
        };

        setLoading(true);
        try {
            const res = await api.post("/admin-login", loginData);

            if (res.data.access_token) {
                localStorage.setItem('token', res.data.access_token);

            // if (!res.ok) {
            //     const data = await res.json().catch(() => ({}));
            //     throw new Error(data?.message || "Login failed");
            // }

            // success handling (token, redirect, etc.)
            // const data = await res.json();
            // handle login success...
            // For demo, we'll just clear the form
            setEmail("");
            setPassword("");
            setRemember(false);
            // Redirect to admin dashboard
            navigate('/admin-dashboard');
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-cyan-50 to-white px-4">
            <div className="max-w-md w-full">
                <div className="bg-white/95 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4zM6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-indigo-700">Admin Portal</h1>
                            <p className="text-sm text-gray-500">Sign in to manage the site</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
                                {error}
                            </div>
                        )}

                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                placeholder="admin@example.com"
                                autoComplete="username"
                            />
                        </label>

                        <label className="block relative">
                            <span className="text-sm font-medium text-gray-700">Password</span>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent pr-10"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute inset-y-0 right-1 px-2 flex items-center text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.97 9.97 0 012.197-5.917M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </label>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-cyan-300"
                                />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="text-cyan-600 hover:underline"
                                onClick={() => {/* TODO: Implement forgot password */}}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md shadow-sm bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 disabled:opacity-60"
                            >
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.2" strokeWidth="4" />
                                        <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                ) : null}
                                <span className="font-medium">{loading ? "Signing in..." : "Sign in"}</span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-400">
                        By signing in you agree to the admin terms and policies.
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Need an account? <button type="button" className="text-indigo-600 hover:underline" onClick={() => {/* TODO: Implement request access */}}>Request access</button>
                </div>
            </div>
        </div>
    );
}