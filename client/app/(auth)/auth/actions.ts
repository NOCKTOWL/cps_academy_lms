"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type LoginState = {
    error: string
}

export async function login(previousState: LoginState, formData: FormData): Promise<LoginState> {
    const identifier = formData.get("email") as string
    const password = formData.get("password") as string;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();

    if (!res.ok) {
        return {
            ...previousState,
            error: data.error.message || "Failed to login. Check your credentials and try again.",
        };
    }

    const cookieStore = await cookies();

    cookieStore.set("jwt", data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
    });

    const userData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth-user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.jwt}`
        }
    });

    const user = await userData.json();

    if (!userData.ok) {
        return {
            ...previousState,
            error: user.error.message || "Failed to fetch user data",
        };
    }

    const roleRoutes: Record<string, string> = {
        "student": "/dashboard/student",
        "instructor": "/dashboard/instructor",
        "content_manager": "/dashboard/content-manager",
        "admin": "/dashboard/admin"
    };

    const role = user.role;

    redirect(roleRoutes[role] || "/");
}

export async function register(
    previousState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!username || !email || !password || !confirmPassword) {
        return {
            ...previousState,
            error: "All fields are required.",
        };
    }

    if (password !== confirmPassword) {
        return {
            ...previousState,
            error: "Passwords do not match.",
        };
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
                cache: "no-store",
            },
        );

        const data = await res.json();

        if (!res.ok || !data.user || !data.jwt) {
            return {
                ...previousState,
                error:
                    data?.error?.message ||
                    data?.message ||
                    "Failed to register user",
            };
        }

        const cookieStore = await cookies();

        cookieStore.set("jwt", data.jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

    } catch (error) {
        console.error("Registration error:", error);

        return {
            ...previousState,
            error: "Something went wrong during registration",
        };
    }
    redirect("/dashboard/student");
}