// client/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

type NavbarProps = {
    user?: {
        username: string;
        role?: {
            type: string;
        };
    } | null;
};

export default function Navbar({ user }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/auth/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const roleType = user?.role?.type;

    const getDashboardLink = () => {
        switch (roleType) {
            case "student":
                return "/dashboard/student";
            case "instructor":
                return "/dashboard/instructor";
            case "content_manager":
                return "/dashboard/content-manager";
            case "admin":
                return "/dashboard/admin";
            default:
                return "/dashboard/student";
        }
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-8">

                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 font-black text-white">
                        C
                    </div>
                    <span className="hidden text-lg font-bold tracking-tight text-white sm:inline">
                        CPS Academy
                    </span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/blogs"
                        className="text-sm font-medium text-slate-300 transition hover:text-white"
                    >
                        Blog
                    </Link>
                    <Link
                        href="/courses"
                        className="text-sm font-medium text-slate-300 transition hover:text-white"
                    >
                        Courses
                    </Link>
                    {user &&
                        (roleType === "instructor" || roleType === "content_manager" || roleType === "admin") && (
                            <Link
                                href={getDashboardLink()}
                                className="text-sm font-medium text-slate-300 transition hover:text-white"
                            >
                                Dashboard
                            </Link>
                        )}

                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="hidden sm:flex sm:items-center sm:gap-3">
                                <div className="rounded-lg px-3 py-2">
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                        {user.username}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {roleType || "user"}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-slate-800"></div>
                            </div>
                            <Link
                                href={getDashboardLink()}
                                className="hidden rounded-lg bg-sky-700/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600/80 sm:inline-block"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-white"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/auth/register"
                                className="rounded-lg bg-sky-700/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600/80"
                            >
                                Get started
                            </Link>
                        </>
                    )}

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="ml-2 inline-flex items-center justify-center rounded-lg p-2 md:hidden"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-slate-800 bg-slate-900 md:hidden">
                    <div className="space-y-2 px-6 py-4">
                        <Link
                            href="/blogs"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/courses"
                            className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                        >
                            Courses
                        </Link>
                        {user && (roleType === "instructor" || roleType === "content_manager" || roleType === "admin") && (
                            <Link
                                href={getDashboardLink()}
                                className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                                Dashboard
                            </Link>
                        )}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}