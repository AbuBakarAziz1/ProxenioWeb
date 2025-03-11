"use client";

import TabSection from "@/components/TabSection";
import { useSession } from "next-auth/react";

export default function Matches() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading user data...</p>;
  }

  if (!session) {
    return <p>Please log in to view your matches.</p>;
  }

  return (
    <div>
      <TabSection userId={session.user.id} />
    </div>
  );
}
