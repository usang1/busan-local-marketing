import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/admin/logout-button";
import { adminNavItems } from "@/lib/admin/constants";
import type { AdminSession } from "@/lib/admin/auth";

export function AdminShell({ children, session }: { children: ReactNode; session: AdminSession }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4">
          <Link href="/admin" className="font-extrabold">
            Admin
          </Link>
          <LogoutButton />
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3" aria-label="관리자 모바일 메뉴">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="grid lg:grid-cols-[248px_1fr]">
        <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white p-5 lg:block">
          <Link href="/admin" className="block rounded-[8px] p-2 font-extrabold text-slate-950">
            광고대행 CRM
          </Link>
          <p className="mt-1 px-2 text-xs leading-5 text-slate-500">{session.email}</p>
          <nav className="mt-8 grid gap-1" aria-label="관리자 메뉴">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[8px] px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-5 left-5 right-5">
            <LogoutButton />
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
