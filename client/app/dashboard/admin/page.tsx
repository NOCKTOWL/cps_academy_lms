
import { requireAuth } from '@/lib/auth';
import AdminPage from './AdminPage';

export default async function page() {
  const {user, jwt} = await requireAuth(["admin"]);
  const dashboard = await fetch(`/api/admin-dashboard`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    },
    cache: "no-store"
  });
  return <AdminPage user={user} dashboard={dashboard} />
}
