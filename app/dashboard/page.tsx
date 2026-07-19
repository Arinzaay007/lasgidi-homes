"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { StatusBadge } from "@/components/Signboard";
import type { Listing, Profile } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(p as Profile);

    if (p?.role === "agent") {
      const { data: l } = await supabase
        .from("listings")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });
      setListings((l as Listing[]) || []);
    }
    setLoading(false);
  }

  async function toggleStatus(listing: Listing) {
    const newStatus = listing.status === "available" ? "taken" : "available";
    await supabase.from("listings").update({ status: newStatus }).eq("id", listing.id);
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, status: newStatus } : l))
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="max-w-4xl mx-auto px-4 py-16 text-ink/60">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display text-3xl text-ink">{profile?.full_name}</h1>
            <p className="text-ink/60 text-sm mt-1 capitalize">
              {profile?.role} {profile?.verified ? "· Verified" : "· Not yet verified"}
            </p>
          </div>
          <button
            onClick={signOut}
            className="text-sm border-2 border-ink px-3 py-2 rounded-sm hover:bg-ink hover:text-white transition"
          >
            Sign out
          </button>
        </div>

        {profile?.role === "agent" ? (
          <>
            <div className="flex justify-between items-center mt-8">
              <h2 className="font-display text-xl text-ink">Your listings</h2>
              <Link
                href="/post"
                className="bg-vermilion text-white text-sm font-display px-4 py-2 rounded-sm"
              >
                + Post house
              </Link>
            </div>
            {listings.length === 0 ? (
              <p className="text-ink/60 mt-4">
                No listings yet. Post your first house to start getting inquiries.
              </p>
            ) : (
              <div className="space-y-3 mt-4">
                {listings.map((l) => (
                  <div
                    key={l.id}
                    className="border-2 border-ink rounded-sm bg-white p-4 flex justify-between items-center"
                  >
                    <div>
                      <Link href={`/listings/${l.id}`} className="font-display text-lg text-ink">
                        {l.title}
                      </Link>
                      <p className="text-sm text-ink/60">
                        {l.area} · ₦{l.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={l.status} />
                      <button
                        onClick={() => toggleStatus(l)}
                        className="text-xs border-2 border-ink px-3 py-1.5 rounded-sm hover:bg-ink hover:text-white transition"
                      >
                        Mark {l.status === "available" ? "Taken" : "Available"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="mt-8">
            <p className="text-ink/60">
              Browse houses and message agents directly.{" "}
              <Link href="/listings" className="text-vermilion underline">
                Start browsing
              </Link>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
