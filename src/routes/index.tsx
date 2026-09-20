import { createFileRoute } from "@tanstack/react-router";
import { HideoutApp } from "@/components/den/hideout-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <HideoutApp />;
}
