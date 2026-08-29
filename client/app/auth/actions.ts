"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type LoginState = {
    error: string;
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
        throw new Error(data.message || "Failed to login");
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
        throw new Error(user.message || "Failed to fetch user data");
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