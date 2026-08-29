import { requireAuth } from '@/lib/auth'
import CoursesPage from './CoursesPage';

export default async function page() {
    const {user, jwt} = await requireAuth(["instructor"]);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/my-courses`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        },
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch courses data`);
    }

    const result = await res.json();

    return <CoursesPage user={user} courses={result.data} />
}
