"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { StatusBadge, VerifiedBadge } from "@/components/Signboard";
import type { Listing, Profile } from "@/lib/types";

type Message = {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [listing, setListing] = useState<Listing | null>(null);
  const [me, setMe] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function load() {
    const { data: listingData } = await supabase
      .from("listings")
      .select("*, profiles(*)")
      .eq("id", id)
      .single();
    setListing(listingData as unknown as Listing);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setMe(profile as Profile);

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("listing_id", id)
        .order("created_at", { ascending: true });
      setMessages((msgs as Message[]) || []);

      const channel = supabase
        .channel(`listing-${id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `listing_id=eq.${id}` },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }

  async function sendMessage() {
    if (!text.trim() || !me || !listing) return;
    await supabase.from("messages").insert({
      listing_id: listing.id,
      sender_id: me.id,
      receiver_id: listing.agent_id,
      content: text.trim(),
    });
    setText("");
  }

  if (!listing) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="max-w-4xl mx-auto px-4 py-16 text-ink/60">Loading...</p>
      </main>
    );
  }

  const agent = listing.profiles;
  const isOwnListing = me?.id === listing.agent_id;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-64 bg-ink/10 rounded-sm overflow-hidden flex items-center justify-center">
            {listing.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-ink/30">No photo</span>
            )}
          </div>

          <div className="flex justify-between items-start mt-4 gap-3">
            <h1 className="font-display text-3xl text-ink">{listing.title}</h1>
            <StatusBadge status={listing.status} />
          </div>
          <p className="text-ink/60 mt-1">
            {listing.area} {listing.landmark ? `· ${listing.landmark}` : ""}
          </p>
          <p className="font-mono text-vermilion text-2xl mt-3">
            ₦{listing.price.toLocaleString()}
            {listing.listing_type === "rent" ? "/yr" : ""}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <div className="border-2 border-ink/20 rounded-sm p-3">
              <p className="text-ink/50">Type</p>
              <p className="font-medium">{listing.property_type}</p>
            </div>
            {listing.bedrooms !== null && (
              <div className="border-2 border-ink/20 rounded-sm p-3">
                <p className="text-ink/50">Bedrooms</p>
                <p className="font-medium">{listing.bedrooms}</p>
              </div>
            )}
            <div className="border-2 border-ink/20 rounded-sm p-3">
              <p className="text-ink/50">Agency fee</p>
              <p className="font-medium font-mono">₦{listing.agency_fee.toLocaleString()}</p>
            </div>
            <div className="border-2 border-ink/20 rounded-sm p-3">
              <p className="text-ink/50">Caution fee</p>
              <p className="font-medium font-mono">₦{listing.caution_fee.toLocaleString()}</p>
            </div>
          </div>

          {listing.description && (
            <p className="mt-6 text-ink/80 leading-relaxed">{listing.description}</p>
          )}
        </div>

        <div>
          <div className="border-2 border-ink rounded-sm bg-white p-4">
            <p className="font-display text-lg text-ink">{agent?.full_name}</p>
            {agent?.verified && (
              <div className="mt-1">
                <VerifiedBadge />
              </div>
            )}
            {agent?.whatsapp && (
              <a
                href={`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                className="block mt-3 text-center bg-verified text-white font-display text-sm tracking-wide py-2 rounded-sm hover:brightness-110"
              >
                Chat on WhatsApp
              </a>
            )}
          </div>

          {me && !isOwnListing && (
            <div className="border-2 border-ink rounded-sm bg-white mt-4 flex flex-col h-80">
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`text-sm max-w-[80%] px-3 py-2 rounded-sm ${
                      m.sender_id === me.id
                        ? "bg-ink text-white ml-auto"
                        : "bg-paper text-ink"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="flex border-t-2 border-ink">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about this house..."
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-vermilion text-white px-4 font-display text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          )}
          {!me && (
            <p className="text-sm text-ink/60 mt-4">
              <a href="/auth" className="underline text-vermilion">
                Sign in
              </a>{" "}
              to message this agent.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
