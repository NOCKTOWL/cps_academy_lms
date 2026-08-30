import { requireAuth } from "@/lib/auth";
import AdminPage from "./AdminPage";

export default async function Page() {
  const { user, jwt } = await requireAuth(["admin"]);

  const [dashboardRes, usersRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
      },
    ),

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/users`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
      },
    ),
  ]);

  if (!dashboardRes.ok || !usersRes.ok) {
    throw new Error("Failed to fetch admin data");
  }

  const dashboard = await dashboardRes.json();
  const usersResult = await usersRes.json();

  return (
    <AdminPage
      user={user}
      dashboard={dashboard}
      users={usersResult.data}
    />
  );
}