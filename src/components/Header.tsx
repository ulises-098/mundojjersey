import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-amber-400/20 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50 p-1 shadow-sm ring-1 ring-amber-400/50">
            <Image
              src="/brand/logo.jpg"
              alt={siteConfig.name}
              width={40}
              height={40}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            {siteConfig.name}
          </span>
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
