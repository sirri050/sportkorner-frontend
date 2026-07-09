"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    AlertCircle,
    Check,
    Eye,
    EyeOff,
    Lock,
    X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/dist/client/components/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const code = searchParams.get("code");

    const STRAPI_URL =
        process.env.NEXT_PUBLIC_STRAPI_URL!;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);

    const validation = useMemo(
        () => ({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        }),
        [password]
    );

    const isPasswordValid = useMemo(
        () => Object.values(validation).every(Boolean),
        [validation]
    );

    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword;

    const canSubmit =
        isPasswordValid && passwordsMatch && !loading;

    async function handleSubmit(
        e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError("");
        setTouched(true);

        if (!code) {
            setError(
                "This reset link is invalid or missing. Please request a new one."
            );
            return;
        }

        if (!isPasswordValid) {
            setError(
                "Please make sure your password meets all the requirements below."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${STRAPI_URL}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        password,
                        passwordConfirmation: confirmPassword,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.error?.message ??
                    "Unable to reset password. The link may have expired."
                );
            }

            setSuccess(true);

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    function Rule({
        valid,
        children,
    }: {
        valid: boolean;
        children: React.ReactNode;
    }) {
        return (
            <div className="flex items-center gap-1.5 text-xs">
                {valid ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />
                ) : (
                    <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
                )}

                <span
                    className={
                        valid
                            ? "text-green-400"
                            : "text-muted-foreground"
                    }
                >
                    {children}
                </span>
            </div>
        );
    }

    if (!code) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background p-6">
                <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>

                    <h1 className="mb-2 text-2xl font-black">
                        Invalid Reset Link
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        This password reset link is invalid or has expired.
                        Please request a new one.
                    </p>

                    <Link
                        href="/forgot-password"
                        className="mt-6 inline-block w-full rounded-2xl bg-brand-primary py-3 font-semibold text-white transition hover:opacity-90"
                    >
                        Request New Link
                    </Link>

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

    if (success) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background p-6">
                <div className="glass w-full max-w-md rounded-3xl p-10 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10">
                        <Lock className="h-10 w-10 text-brand-primary" />
                    </div>

                    <h1 className="mb-3 text-3xl font-black">
                        Password Updated
                    </h1>

                    <p className="text-muted-foreground">
                        Your password has been changed successfully.
                    </p>

                    <p className="mt-4 text-sm text-muted-foreground">
                        Redirecting to login...
                    </p>
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
                        Reset Password
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Create a strong password to secure your account.
                    </p>
                </div>

                {/* Error Alert */}

                {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit} noValidate>

                    {/* Password */}

                    <div>

                        <label className="mb-1.5 block text-sm font-medium">
                            New Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showPassword ? "text" : "password"
                                }
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError("");
                                }}
                                onBlur={() => setTouched(true)}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                className={`w-full rounded-2xl border bg-card px-5 py-3 pr-14 outline-none transition focus:border-brand-primary ${
                                    touched && password.length > 0 && !isPasswordValid
                                        ? "border-red-500/40"
                                        : "border-border"
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Confirm */}

                    <div>

                        <label className="mb-1.5 block text-sm font-medium">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (error) setError("");
                                }}
                                onBlur={() => setTouched(true)}
                                placeholder="Confirm password"
                                autoComplete="new-password"
                                className={`w-full rounded-2xl border bg-card px-5 py-3 pr-14 outline-none transition focus:border-brand-primary ${
                                    confirmPassword.length > 0 && !passwordsMatch
                                        ? "border-red-500/40"
                                        : "border-border"
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Password Rules */}

                    <div className="rounded-2xl border border-border bg-card p-4">

                        <h3 className="mb-2.5 text-sm font-semibold">
                            Password Requirements
                        </h3>

                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">

                            <Rule valid={validation.length}>
                                At least 8 characters
                            </Rule>

                            <Rule valid={validation.uppercase}>
                                One uppercase letter
                            </Rule>

                            <Rule valid={validation.lowercase}>
                                One lowercase letter
                            </Rule>

                            <Rule valid={validation.number}>
                                One number
                            </Rule>

                            <Rule valid={validation.special}>
                                One special character
                            </Rule>

                        </div>

                    </div>

                    {/* Password Match */}

                    {confirmPassword.length > 0 && (
                        <div
                            className={`rounded-xl px-4 py-2.5 text-sm ${passwordsMatch
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            {passwordsMatch
                                ? "Passwords match."
                                : "Passwords do not match."}
                        </div>
                    )}

                    {/* Button */}

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full rounded-2xl bg-brand-primary py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Resetting Password..." : "Reset Password"}
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