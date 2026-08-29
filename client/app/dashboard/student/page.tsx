
import { requireAuth } from '@/lib/auth';
import StudentPage from './StudentPage'

export default async function page() {
  const { user, jwt } = await requireAuth(["student"]);
  const dashboard = await fetch(`/api/student/dashboard`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    },
    cache: "no-store"
  });
  return <StudentPage user={user} dashboard={dashboard} />
}
