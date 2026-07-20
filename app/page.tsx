import Link from "next/link";
import Navbar from "@/components/Navbar";
import { StatusBadge, VerifiedBadge } from "@/components/Signboard";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase
    .from("listings")
    .select("*, profiles(*)")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(12);
  const listings = (data as unknown as Listing[]) || [];

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

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink">Latest houses</h2>
          <Link href="/listings" className="text-sm text-vermilion underline">
            See all + filters
          </Link>
        </div>

        {listings.length === 0 ? (
          <p className="text-ink/60 mt-6">
            No houses posted yet — check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/listings/${l.id}`}
                className="border-2 border-ink rounded-sm bg-white overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-40 bg-ink/10 flex items-center justify-center">
                  {l.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.images[0]}
                      alt={l.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-ink/30">No photo</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display text-lg text-ink leading-tight">
                      {l.title}
                    </h3>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="text-sm text-ink/60 mt-1">
                    {l.area} {l.landmark ? `· ${l.landmark}` : ""}
                  </p>
                  <p className="font-mono text-vermilion text-lg mt-2">
                    ₦{l.price.toLocaleString()}
                    {l.listing_type === "rent" ? "/yr" : ""}
                  </p>
                  {l.profiles?.verified && (
                    <div className="mt-2">
                 <VerifiedBadge />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
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
