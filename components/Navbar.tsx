import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b-4 border-ink bg-paper sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl text-ink tracking-wide">
          LASGIDI <span className="text-vermilion">HOMES</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/listings" className="hover:text-vermilion transition">
            Browse
          </Link>
          <Link href="/post" className="hover:text-vermilion transition">
            Post a house
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-vermilion transition"
          >
            Dashboard
          </Link>
          <Link
            href="/auth"
            className="bg-ink text-white px-4 py-2 rounded-sm font-display text-sm tracking-wide hover:bg-vermilion transition"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}
