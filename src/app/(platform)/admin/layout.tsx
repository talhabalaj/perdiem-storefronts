import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = { title: "Admin" };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <Suspense
        fallback={
          <div className="h-14 border-b border-foreground/10 lg:h-dvh lg:border-r lg:border-b-0" />
        }
      >
        <AdminSidebar />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
