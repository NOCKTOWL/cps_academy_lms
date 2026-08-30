import { requireAuth } from '@/lib/auth'
import InstructorPage from './InstructorPage'

export default async function page() {
    const {user, jwt} = await requireAuth(["instructor", "admin"]);

    const dashboard = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/instructor/dashboard`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        },
        cache: "no-store"
    });

    if (!dashboard.ok) {
        throw new Error(`Failed to fetch dashboard data`);
    }

    const dashboardData = await dashboard.json();

    return <InstructorPage user={user} dashboard={dashboardData} />
}
