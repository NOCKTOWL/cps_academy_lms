import { requireAuth } from "@/lib/auth";
import ContentManagerPage from "./ContentManagerPage";

export default async function Page() {
  const { user, jwt } = await requireAuth(["content_manager"]);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/content-manager/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const dashboard = await res.json();
  console.log("Dashboard data:", dashboard);

  return (
    <ContentManagerPage
      user={user}
      dashboard={dashboard}
    />
  );
}