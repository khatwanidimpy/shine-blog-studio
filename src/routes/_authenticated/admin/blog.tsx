import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/blogs/new", replace: true });
  },
});
