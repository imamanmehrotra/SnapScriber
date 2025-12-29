"use client";

import React, { useState, useEffect, ReactNode, ChangeEvent } from "react";

const tones = ["Casual", "Funny", "Inspirational", "Sarcastic", "Romantic", "Nostalgic", "Calm", "Exciting", "Happy", "Poetic"] as const;
const creativityLevels = ["Low", "Medium", "High"] as const;
const captionLengths = ["10 - 20", "20 - 80", "80 - 140", "140 - 200"] as const;
const languages = ["English", "Spanish", "French", "German", "Italian"] as const;

type Caption = { text: string; hashtag: string };

type Flow = "image" | "text";

type FormState = {
  tone: (typeof tones)[number];
  creativity: (typeof creativityLevels)[number];
  captionLength: (typeof captionLengths)[number];
  language: (typeof languages)[number];
  keywords: string;
  numCaptions: number;
  file?: File | null;
};

const initialState: FormState = {
  tone: "Casual",
  creativity: "Medium",
  captionLength: "20 - 80",
  language: "English",
  keywords: "",
  numCaptions: 2,
  file: null,
};

export default function HomePage() {
  const [flow, setFlow] = useState<Flow>("image");
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    setCaptions([]);
    setError(null);
  }, [flow]);

  const handleFile = (file: File | null) => {
    setForm((f) => ({ ...f, file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const copyCaption = async (caption: Caption, idx: number) => {
    const textToCopy = `${caption.text}\n${caption.hashtag}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      setError("Unable to copy. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setCaptions([]);

    try {
      if (flow === "image") {
        if (!form.file) throw new Error("Please upload an image.");
        const body = new FormData();
        body.append("file", form.file);
        body.append("tone", form.tone);
        body.append("creativity", form.creativity);
        body.append("captionLength", form.captionLength);
        body.append("language", form.language);
        body.append("keywords", form.keywords);
        body.append("numCaptions", String(form.numCaptions));

        const res = await fetch("/api/captions/image", { method: "POST", body });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setCaptions(data.captions ?? []);
      } else {
        const payload = {
          tone: form.tone,
          creativity: form.creativity,
          captionLength: form.captionLength,
          language: form.language,
          keywords: form.keywords,
          numCaptions: form.numCaptions,
        };
        const res = await fetch("/api/captions/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setCaptions(data.captions ?? []);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <section className="hero-banner">
        <div>
          <h1 className="hero-title">SNAPSCRIBE</h1>
          <p className="hero-sub">
            Warm, artful captions for photographers, makers, and storytellers. Elevate every frame with language
            that matches your vibe.
          </p>
        </div>
        <div className="feature-strip" style={{ background: "rgba(255,255,255,0.1)", color: "#f8f3ed", borderColor: "rgba(255,255,255,0.2)" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Why creators love us</div>
          <div>• On-brand tones and hashtags</div>
          <div>• Groq-powered speed</div>
          <div>• Crafted for social-ready posts</div>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-3">
        <button
          className={`tab ${flow === "image" ? "tab-active" : ""}`}
          onClick={() => setFlow("image")}
        >
          SnapScribe (Image)
        </button>
        <button
          className={`tab ${flow === "text" ? "tab-active" : ""}`}
          onClick={() => setFlow("text")}
        >
          VibeText (Text)
        </button>
      </div>

      <div className="rounded-2xl border border-boho-border bg-white shadow-boho p-5 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="pill" style={{ background: "rgba(199,125,99,0.15)", color: "#3c302a" }}>
                {flow === "image" ? "SnapScribe" : "VibeText"}
              </p>
              <h2 className="section-title text-xl">
                {flow === "image" ? "Upload an image" : "Enter keywords"}
              </h2>
              <p className="text-sm text-boho-muted">
                {flow === "image"
                  ? "Add an image, pick a vibe, and get captions with hashtags."
                  : "Drop keywords, pick a tone, and receive JSON-formatted captions with hashtags."}
              </p>
            </div>
          </div>

          {flow === "image" ? (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-boho-text">Image upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                className="file-input"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="rounded-xl border border-boho-border shadow-boho max-h-72 object-contain"
                />
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-boho-text">Keywords</label>
              <textarea
                value={form.keywords}
                onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
                placeholder="e.g., sunset, beach, ocean, couple"
                className="textarea"
                rows={4}
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="label">Tone</label>
              <select
                value={form.tone}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setForm((f) => ({ ...f, tone: e.target.value as FormState["tone"] }))
                }
                className="select"
              >
                {tones.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="label">Creativity</label>
              <select
                value={form.creativity}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setForm((f) => ({ ...f, creativity: e.target.value as FormState["creativity"] }))
                }
                className="select"
              >
                {creativityLevels.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="label">Caption length</label>
              <select
                value={form.captionLength}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setForm((f) => ({ ...f, captionLength: e.target.value as FormState["captionLength"] }))
                }
                className="select"
              >
                {captionLengths.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="label">Language</label>
              <select
                value={form.language}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setForm((f) => ({ ...f, language: e.target.value as FormState["language"] }))
                }
                className="select"
              >
                {languages.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="label"># Captions</label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.numCaptions}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm((f) => ({ ...f, numCaptions: Number(e.target.value) }))
                }
                className="select"
              />
            </div>
            <div className="space-y-2">
              <label className="label">Keywords (optional)</label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm((f) => ({ ...f, keywords: e.target.value }))
                }
                placeholder="comma separated"
                className="select"
              />
            </div>
          </div>

          <button className="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating…" : "Generate captions"}
          </button>

          {error && <div className="error">{error}</div>}

          <div className="pt-2 space-y-3">
            <h3 className="section-title text-lg">Captions</h3>
            {captions.length === 0 && <p className="text-sm text-boho-muted">No captions yet.</p>}
            <div className="flex flex-col gap-3">
              {captions.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-boho-border bg-gradient-to-br from-amber-50 via-white to-rose-50 shadow-sm p-4"
                  style={{ boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-boho-text">Caption {idx + 1}</div>
                    <button
                      type="button"
                      onClick={() => copyCaption(c, idx)}
                      className="text-xs font-semibold text-boho-accent hover:text-boho-text transition-colors px-2 py-1 rounded-lg border border-transparent hover:border-boho-border"
                    >
                      {copiedIdx === idx ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="text-sm text-boho-text/90 leading-relaxed whitespace-pre-line">
                    {c.text}
                  </div>
                  <div className="text-xs text-boho-accent font-semibold mt-2">
                    {c.hashtag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

