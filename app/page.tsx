import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20">
        <div className="max-w-2xl">
          <span className="signboard signboard--available text-xs mb-6">
            Live in Lagos
          </span>
          <h1 className="font-display text-5xl sm:text-7xl text-ink leading-[0.95] mt-4">
            NO WAHALA.
            <br />
            <span className="text-vermilion">FIND YOUR HOUSE</span>
            <br />
            DIRECT FROM AGENT.
          </h1>
          <p className="mt-6 text-lg text-ink/80 max-w-lg">
            Real listings across Lagos — Lekki, Yaba, Ikeja, Surulere and more.
            Verified agents, no fake inspection fees, no double posting.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/listings"
              className="bg-vermilion text-white font-display text-lg tracking-wide px-6 py-3 rounded-sm hover:brightness-110 transition"
            >
              Browse Houses
            </Link>
            <Link
              href="/post"
              className="border-2 border-ink text-ink font-display text-lg tracking-wide px-6 py-3 rounded-sm hover:bg-ink hover:text-white transition"
            >
              I'm an Agent →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-ink bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-4 py-14 grid sm:grid-cols-3 gap-8">
          <div>
            <p className="font-mono text-gold text-sm">01</p>
            <h3 className="font-display text-xl mt-2">Search by area</h3>
            <p className="text-paper/70 text-sm mt-1">
              Filter by neighborhood, price in Naira, and bedrooms — see only
              what fits your budget.
            </p>
          </div>
          <div>
            <p className="font-mono text-gold text-sm">02</p>
            <h3 className="font-display text-xl mt-2">Message the agent</h3>
            <p className="text-paper/70 text-sm mt-1">
              Chat directly on the platform or WhatsApp. No middleman, no
              agent-of-agent chain.
            </p>
          </div>
          <div>
            <p className="font-mono text-gold text-sm">03</p>
            <h3 className="font-display text-xl mt-2">Verified badge</h3>
            <p className="text-paper/70 text-sm mt-1">
              Agents get verified with NIN/CAC before their listings carry the
              green badge.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
