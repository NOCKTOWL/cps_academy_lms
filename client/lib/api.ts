const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchAPI(
    endpoint: string,
    options: RequestInit = {},
) {
    const res = await fetch(`${API_URL}${endpoint}`, options)
    
    if (!res.ok) {
        console.error(res.statusText)
        throw new Error(`Failed to fetch API: ${res.statusText}`)
    }

    return res.json()
}