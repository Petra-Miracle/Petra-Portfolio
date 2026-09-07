"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { clearSession, getToken } from "@/lib/admin-api";
import { Loader2 } from "lucide-react";

const AdminDashboard = dynamic(
  () =>
    import("@/components/admin/AdminDashboard").then(
      (m) => m.AdminDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-foreground/60">
        <Loader2 size={18} className="animate-spin" />
        Memeriksa sesi...
      </div>
    ),
  },
);

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
    }

    function onUnauthorized() {
      clearSession();
      router.replace("/admin/login");
    }

    window.addEventListener("petra:unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("petra:unauthorized", onUnauthorized);
  }, [router]);

  function handleLogout() {
    clearSession();
    router.replace("/admin/login");
  }

  return <AdminDashboard onLogout={handleLogout} />;
}