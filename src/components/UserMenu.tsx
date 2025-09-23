"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = useState(false);

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Checking session…</div>;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">{session.user?.name || session.user?.email}</span>
      <button
        disabled={submitting}
        onClick={async () => {
          setSubmitting(true);
          try { await signOut({ callbackUrl: "/login" }); } finally { setSubmitting(false); }
        }}
        className="px-3 py-1 rounded bg-gray-200 text-sm hover:bg-gray-300 disabled:opacity-50"
      >
        {submitting ? "…" : "Sign Out"}
      </button>
    </div>
  );
}
