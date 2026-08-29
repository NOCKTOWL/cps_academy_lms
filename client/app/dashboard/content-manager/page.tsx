
import { requireAuth } from '@/lib/auth';
import ContentManagerPage from './ContentManagerPage'

export default async function page() {
  const { user, jwt } = await requireAuth(["content_manager"]);

  const dashboard = await fetch(`/api/content-manager-dashboard`, {
    headers: {
      "Authorization": `Bearer ${jwt}`
    },
    cache: "no-store"
  });

  return <ContentManagerPage user={user} dashboard={dashboard} />
}
