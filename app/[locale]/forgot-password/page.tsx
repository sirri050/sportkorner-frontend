"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    AlertCircle,
    ArrowLeft,
    Mail,
    MailCheck,
} from "lucide-react";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
    const STRAPI_URL =
        process.env.NEXT_PUBLIC_STRAPI_URL!;

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email.trim());

    // Countdown ticker for the resend cooldown.
    useEffect(() => {
        if (cooldown <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        intervalRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [cooldown > 0]);

    async function sendResetEmail(targetEmail: string) {
        setError("");

        try {
            setLoading(true);

            const res = await fetch(
                `${STRAPI_URL}/api/auth/forgot-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: targetEmail,
                    }),
                }
            );

            let data: any = null;

            try {
                data = await res.json();
            } catch {
                // Strapi sometimes returns an empty body on success.
            }

            if (!res.ok) {
                const message = data?.error?.message;

                if (res.status === 429) {
                    throw new Error(
                        "Too many requests. Please wait a moment and try again."
                    );
                }

                if (res.status >= 500) {
                    throw new Error(
                        "Something went wrong on our end. Please try again shortly."
                    );
                }

                throw new Error(
                    message ??
                    "Unable to send reset email. Please try again."
                );
            }

            // Strapi v5 always returns { ok: true } on success and does
            // not reveal whether the email exists, to prevent account
            // enumeration. We treat any 2xx response as success.
            setSuccess(true);
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            if (err instanceof TypeError) {
                // Typically a network failure (fetch rejects on network errors).
                setError(
                    "Couldn't reach the server. Please check your connection and try again."
                );
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!isEmailValid) {
            setError("Please enter a valid email address.");
            return;
        }

        if (cooldown > 0) {
            return;
        }

        await sendResetEmail(email.trim());
    }

    async function handleResend() {
        if (cooldown > 0 || loading || !email.trim()) return;
        await sendResetEmail(email.trim());
    }

    if (success) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background p-6">
                <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                        <MailCheck className="h-8 w-8 text-brand-primary" />
                    </div>

                    <h1 className="mb-2 text-2xl font-black">
                        Check Your Email
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        If an account exists for{" "}
                        <span className="font-medium text-foreground">
                            {email}
                        </span>
                        , we've sent a link to reset your password.
                    </p>

                    <p className="mt-3 text-xs text-muted-foreground">
                        Didn't get it? Check your spam folder, or resend
                        below.
                    </p>

                    {error && (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-sm text-red-400">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={handleResend}
                        disabled={cooldown > 0 || loading}
                        className="mt-6 w-full rounded-2xl bg-brand-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Resending..."
                            : cooldown > 0
                            ? `Resend Email (${cooldown}s)`
                            : "Resend Email"}
                    </button>

                    <button
                        onClick={() => {
                            setSuccess(false);
                            setEmail("");
                            setError("");
                            setCooldown(0);
                        }}
                        className="mt-3 w-full rounded-2xl border border-border bg-card py-3 font-semibold transition hover:border-brand-primary"
                    >
                        Try a Different Email
                    </button>

                    <Link
                        href="/login"
                        className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-brand-primary"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-8">

            {/* Background Glow */}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f9731625,transparent_45%)]" />

            <div className="glass relative z-10 w-full max-w-xl rounded-[28px] p-6 md:p-8">

                {/* Logo */}

                <div className="mb-6 text-center">

                    <img
                        src="/icons/icon-512.png"
                        alt="SportKorner"
                        className="mx-auto mb-3 h-14 w-14 rounded-2xl shadow-lg"
                    />

                    <h1 className="font-heading text-3xl font-black uppercase">
                        Forgot Password
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your email and we'll send you a link to reset
                        your password.
                    </p>
                </div>

                {/* Error Alert */}

                {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>

                    {/* Email */}

                    <div>

                        <label className="mb-1.5 block text-sm font-medium">
                            Email Address
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error) setError("");
                                }}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className={`w-full rounded-2xl border bg-card py-3 pl-12 pr-5 outline-none transition focus:border-brand-primary ${
                                    error ? "border-red-500/40" : "border-border"
                                }`}
                            />

                        </div>

                    </div>

                    {/* Button */}

                    <button
                        type="submit"
                        disabled={loading || cooldown > 0}
                        className="w-full rounded-2xl bg-brand-primary py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Sending Link..."
                            : cooldown > 0
                            ? `Try Again in ${cooldown}s`
                            : "Send Reset Link"}
                    </button>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-brand-primary"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </Link>

                </form>

            </div>
        </main>
    );
}