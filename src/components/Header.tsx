import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
          {siteConfig.name}
        </Link>
        <nav className="text-sm text-neutral-500">
          <Link href="/admin/login" className="transition-colors hover:text-neutral-300">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
