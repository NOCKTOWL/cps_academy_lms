"use client";

import { useState, useTransition } from "react";
import { changeUserRole } from "./actions";

import Link from "next/link";

import type { User } from "@/types/user";

type Dashboard = {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalContentManagers: number;
  totalCourses: number;
  totalEnrollments: number;
};

type AdminUser = {
  documentId: string;
  username: string;
  email: string;
  role?: {
    name: string;
    type: string;
  };
};

export default function AdminPage({
  user,
  dashboard,
  users,
}: {
  user: User;
  dashboard: Dashboard;
  users: AdminUser[];
}) {
  const [userList, setUserList] = useState(users);
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(
    documentId: string,
    role: string,
  ) {
    startTransition(async () => {
      const result = await changeUserRole(
        documentId,
        role,
      );

      if (!result.success) {
        alert(result.message);
        return;
      }

      setUserList((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.documentId === documentId
            ? {
                ...currentUser,
                role: {
                  ...currentUser.role!,
                  type: role,
                  name: role.replace("_", " "),
                },
              }
            : currentUser,
        ),
      );
    });
  }

  const stats = [
    {
      label: "Total Users",
      value: dashboard.totalUsers,
    },
    {
      label: "Students",
      value: dashboard.totalStudents,
    },
    {
      label: "Instructors",
      value: dashboard.totalInstructors,
    },
    {
      label: "Content Managers",
      value: dashboard.totalContentManagers,
    },
    {
      label: "Courses",
      value: dashboard.totalCourses,
    },
    {
      label: "Enrollments",
      value: dashboard.totalEnrollments,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Welcome back, {user.username}
          </p>
        </div>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/courses"
            className="rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-500"
          >
            <h2 className="text-xl font-bold">Manage Courses</h2>

            <p className="mt-2 text-sm text-slate-400">
              Create, edit, and manage courses.
            </p>
          </Link>

          <Link
            href="/dashboard/content-manager/blogs"
            className="rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-500"
          >
            <h2 className="text-xl font-bold">Manage Blogs</h2>

            <p className="mt-2 text-sm text-slate-400">
              Create, edit, and manage blog posts.
            </p>
          </Link>
        </section>

        {/* Users */}
        <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            Manage Users
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-700 text-sm text-slate-400">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Change Role</th>
                </tr>
              </thead>

              <tbody>
                {userList.map((listedUser) => (
                  <tr
                    key={listedUser.documentId}
                    className="border-b border-slate-800"
                  >
                    <td className="p-3">
                      {listedUser.username}
                    </td>

                    <td className="p-3 text-slate-400">
                      {listedUser.email}
                    </td>

                    <td className="p-3 capitalize">
                      {listedUser.role?.name ||
                        listedUser.role?.type ||
                        "No role"}
                    </td>

                    <td className="p-3">
                      <select
                        value={
                          listedUser.role?.type ||
                          "student"
                        }
                        disabled={isPending}
                        onChange={(event) =>
                          handleRoleChange(
                            listedUser.documentId,
                            event.target.value,
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 capitalize outline-none"
                      >
                        <option value="student">
                          Student
                        </option>

                        <option value="instructor">
                          Instructor
                        </option>

                        <option value="content_manager">
                          Content Manager
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}