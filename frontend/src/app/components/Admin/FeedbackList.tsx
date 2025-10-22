"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API } from "@/app/config";
import { Feedback } from "@/app/components/Admin/types";
import {  ChevronLeft, ChevronRight } from "lucide-react";

type ApiResp = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: Feedback[];
};

export default function FeedbackList({
  title = "Ирсэн санал хүсэлт",
  limit: initialLimit = 10,
  compact = false, // ✅ шахмал горим
}: {
  title?: string;
  limit?: number;
  compact?: boolean;
}) {
  const [items, setItems] = useState<Feedback[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (p = page) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<ApiResp>(`${API}/api/feedback`, {
        params: { page: p, limit },
      });
      setItems(res.data.items);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.response?.data?.message || "Санал татахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(s) ||
        it.message.toLowerCase().includes(s)
    );
  }, [items, q]);

  const prettyDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="bg-[#151518] border border-gray-700 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-bold text-[#a7ffea]">{title}</h2>

        {/* 🔎 Хайх (compact үед нууж болно) */}
        {!compact && (
          <div className="relative w-64">
            <input
              placeholder="Хайх (нэр, мессеж)…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-3 pr-20 py-2 rounded-md bg-black/60 border border-gray-700 text-sm"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white px-1"
                title="Цэвэрлэх"
                aria-label="Цэвэрлэх"
              >
                ×
              </button>
            )}
            <button
              type="button"
              onClick={() => fetchData(1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 border border-white/10 text-xs"
              title="Дахин татах"
              aria-label="Дахин татах"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      {loading ? (
        <div className="py-8 text-center text-gray-300">Уншиж байна…</div>
      ) : error ? (
        <div className="py-6 text-center text-red-300">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-gray-400">Санал олдсонгүй.</div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((f) => (
            <li
              key={f._id}
              className="rounded-lg border border-white/10 bg-[#0b0b0d]/70 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{f.name}</div>
                <div className="text-xs text-gray-400">
                  {prettyDate(f.createdAt)}
                </div>
              </div>
              <p className="text-sm text-gray-200 mt-2 whitespace-pre-wrap">
                {f.message}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination (compact үед нуух) */}
      {!compact && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-400">
            Хуудас: <span className="font-semibold">{page}</span> / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData(Math.max(1, page - 1))}
              disabled={page <= 1 || loading}
              className={`p-2 rounded-md border border-white/10 ${
                page <= 1 || loading
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/15"
              }`}
              aria-label="Өмнөх"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => fetchData(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || loading}
              className={`p-2 rounded-md border border-white/10 ${
                page >= totalPages || loading
                  ? "bg-white/5 text-white/40 cursor-not-allowed"
                  : "bg-white/10 hover:bg-white/15"
              }`}
              aria-label="Дараах"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
