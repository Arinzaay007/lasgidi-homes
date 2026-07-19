"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { LAGOS_AREAS, PROPERTY_TYPES } from "@/lib/types";

export default function PostListingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    listing_type: "rent",
    property_type: PROPERTY_TYPES[0],
    bedrooms: "",
    area: LAGOS_AREAS[0],
    landmark: "",
    agency_fee: "",
    caution_fee: "",
  });

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setAllowed(profile?.role === "agent");
      setChecking(false);
    })();
  }, []);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let imageUrls: string[] = [];
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file);
      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }
      const { data: publicUrl } = supabase.storage
        .from("listing-images")
        .getPublicUrl(path);
      imageUrls = [publicUrl.publicUrl];
    }

    const { error: insertError } = await supabase.from("listings").insert({
      agent_id: user.id,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      listing_type: form.listing_type,
      property_type: form.property_type,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      area: form.area,
      landmark: form.landmark,
      agency_fee: Number(form.agency_fee || 0),
      caution_fee: Number(form.caution_fee || 0),
      images: imageUrls,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  if (checking) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="max-w-2xl mx-auto px-4 py-16 text-ink/60">Checking your account...</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h1 className="font-display text-3xl text-ink">Agents only</h1>
          <p className="text-ink/70 mt-2">
            Only accounts registered as agents can post listings. Sign in with an
            agent account, or create one.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl text-ink">Post a house</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            placeholder="Title, e.g. Spacious 2 Bedroom Flat in Yaba"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full border-2 border-ink rounded-sm px-3 py-2 bg-white"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full border-2 border-ink rounded-sm px-3 py-2 bg-white h-24"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.listing_type}
              onChange={(e) => update("listing_type", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            >
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
            <select
              value={form.property_type}
              onChange={(e) => update("property_type", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            >
              {PROPERTY_TYPES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.area}
              onChange={(e) => update("area", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            >
              {LAGOS_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <input
              placeholder="Landmark (optional)"
              value={form.landmark}
              onChange={(e) => update("landmark", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              placeholder="Price (₦)"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            />
            <input
              type="number"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Agency fee (₦)"
              value={form.agency_fee}
              onChange={(e) => update("agency_fee", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            />
            <input
              type="number"
              placeholder="Caution fee (₦)"
              value={form.caution_fee}
              onChange={(e) => update("caution_fee", e.target.value)}
              className="border-2 border-ink rounded-sm px-3 py-2 bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-ink/70">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block mt-1 text-sm"
            />
          </div>
          {error && <p className="text-vermilion text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-vermilion text-white font-display text-lg tracking-wide py-3 rounded-sm hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post listing"}
          </button>
        </form>
      </section>
    </main>
  );
}
