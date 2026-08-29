import {cookies} from "next/headers"
import {redirect} from "next/navigation"

export async function requireAuth(allowedRoles: string[]) {
    const cookieStore = await cookies();

    const jwt = cookieStore.get("jwt")?.value;

    if (!jwt) {
        redirect("/auth/login");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth-user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        redirect("/auth/login");
    }

    const user = await res.json();

    if (!allowedRoles.includes(user.role)) {
        redirect("/");
    }

    return {user, jwt};
}