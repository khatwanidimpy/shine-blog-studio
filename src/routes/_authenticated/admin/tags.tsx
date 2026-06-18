import { createFileRoute } from "@tanstack/react-router";
import { Manager } from "./categories";

export const Route = createFileRoute("/_authenticated/admin/tags")({
  component: () => <Manager kind="tags" title="Tags" />,
});
