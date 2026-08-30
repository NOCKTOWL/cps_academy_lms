
import { requireAuth } from '@/lib/auth';
import StudentPage from './StudentPage'

export default async function page() {
  const { user, jwt } = await requireAuth(["student"]);

  const res = await fetch(`${
    process.env.NEXT_PUBLIC_API_URL
  }/api/student/dashboard`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    },
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard data`);
  }

  const dashboard = await res.json();
  console.log(dashboard);

  return <StudentPage user={user} dashboard={dashboard} />
}
