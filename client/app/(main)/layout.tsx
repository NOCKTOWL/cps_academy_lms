import Navbar from "@/components/Navbar";
import { requireAuth } from "@/lib/auth";

async function getUser() {
  try {
    const { user } = await requireAuth([
      "student",
      "instructor",
      "content_manager",
      "admin",
    ]);

    return user;
  } catch {
    return null;
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}