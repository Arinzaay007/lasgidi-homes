"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { StatusBadge, VerifiedBadge } from "@/components/Signboard";
import { LAGOS_AREAS, type Listing } from "@/lib/types";

export default function ListingsPage() {
  const supabase = createClient();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listingType, setListingType] = useState("");

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, maxPrice, listingType]);

  async function fetchListings() {
    setLoading(true);
    let query = supabase
      .from("listings")
      .select("*, profiles(*)")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (area) query = query.eq("area", area);
    if (listingType) query = query.eq("listing_type", listingType);
    if (maxPrice) query = query.lte("price", Number(maxPrice));

    const { data } = await query;
    setListings((data as unknown as Listing[]) || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-display text-4xl text-ink">Browse Houses</h1>

        <div className="flex flex-wrap gap-3 mt-6">
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border-2 border-ink rounded-sm px-3 py-2 bg-white text-sm"
          >
            <option value="">All areas</option>
            {LAGOS_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="border-2 border-ink rounded-sm px-3 py-2 bg-white text-sm"
          >
            <option value="">Rent or Sale</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
          <input
            type="number"
            placeholder="Max price (₦)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border-2 border-ink rounded-sm px-3 py-2 bg-white text-sm w-40"
          />
        </div>

        {loading ? (
          <p className="mt-10 text-ink/60">Loading listings...</p>
        ) : listings.length === 0 ? (
          <p className="mt-10 text-ink/60">
            No houses match yet. Try widening your filters.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
    </main>
  );
}
