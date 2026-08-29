"use client"

import { useActionState } from "react"
import { login } from "@/app/auth/actions"

const initialState = { error: "", };

export default function LoginPage() {

    const [state, formAction, isPending] = useActionState(login, initialState);

    return (
        <main>
        <h1>Login</h1>

        <form action={formAction}>
            <div>
            <label>Email</label>
            <input type="email" name="email" />
            </div>

            <div>
            <label>Password</label>
            <input type="password" name="password" />
            </div>

            {state.error && <p style={{ color: "red" }}>{state.error}</p>}

            <button type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
            </button>
        </form>
        </main>
    )
}
