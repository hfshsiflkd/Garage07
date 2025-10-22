"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import StatusBar from "./StatusBar";
import ActionButtons from "./ActionButtons";
import PhonesModal from "./PhonesModal";
import FeedbackModal from "./FeedbackModal";
import { API } from "@/app/config";

export type FooterProps = {
  open?: string;
  close?: string;
  phone?: string | string[];
  instagram?: string;
};

function parseHM(hhmm: string) {
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  return { h, m };
}

export default function Footer({
  open = "12:00",
  close = "00:00",
  phone = "",
  instagram = "",
}: FooterProps) {
  // цаг/статус
  const [{ h: oh, m: om }, { h: ch, m: cm }] = useMemo(
    () => [parseHM(open), parseHM(close)],
    [open, close]
  );
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const isOpen = useMemo(() => {
    const cur = now.getHours() * 60 + now.getMinutes();
    const start = oh * 60 + om;
    const end = ch * 60 + cm;
    return end <= start ? cur >= start || cur < end : cur >= start && cur < end;
  }, [now, oh, om, ch, cm]);

  // дугаарууд
  const phones = useMemo(
    () =>
      Array.isArray(phone)
        ? phone
        : phone
        ? phone.split(",").map((p) => p.trim())
        : [],
    [phone]
  );

  // модалууд
  const [showPhones, setShowPhones] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Feedback form state (энд удирдана, modal руу дамжуулна)
  const [fbName, setFbName] = useState("");
  const [fbMsg, setFbMsg] = useState("");
  const [fbLoading, setFbLoading] = useState(false);
  const [fbError, setFbError] = useState<string | null>(null);
  const [fbSuccess, setFbSuccess] = useState(false);
  const [honey, setHoney] = useState(""); // honeypot

  const resetFeedback = () => {
    setFbName("");
    setFbMsg("");
    setFbError(null);
    setFbSuccess(false);
    setHoney("");
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fbLoading) return;
    setFbError(null);

    if (!fbName.trim() || !fbMsg.trim()) {
      setFbError("Нэр болон санал хоосон байна.");
      return;
    }
    if (honey) {
      setFbError("Анхааруулга: илгээх боломжгүй.");
      return;
    }

    try {
      setFbLoading(true);
      await axios.post(`${API}/api/feedback`, {
        name: fbName.trim(),
        message: fbMsg.trim(),
      });
      setFbSuccess(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFbLoading(false);
        resetFeedback();
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Санал илгээхэд алдаа гарлаа. Дахин оролдоно уу.";
      setFbError(msg);
      setFbLoading(false);
    }
  };

  const openInstagram = () => {
    if (!instagram) return;
    const url = instagram.startsWith("http")
      ? instagram
      : `https://instagram.com/${instagram.replace(/^@/, "")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const call = (p: string) => {
    window.location.href = `tel:${p.replace(/\s/g, "")}`;
  };

  return (
    <footer className="mt-3 flex-shrink-0 -mx-3 -mb-3 px-3 pb-3">
      <div className="rounded-2xl border border-white/10 bg-[#0b0b0d]/70 backdrop-blur-md px-3 py-2 relative">
        <StatusBar isOpen={isOpen} open={open} close={close} />
        <ActionButtons
          phones={phones}
          instagram={instagram}
          onOpenPhones={() => setShowPhones(true)}
          onOpenFeedback={() => setShowFeedback(true)}
          onOpenInstagram={openInstagram}
        />
      </div>

      <PhonesModal
        open={showPhones}
        phones={phones}
        onClose={() => setShowPhones(false)}
        onCall={call}
      />

      <FeedbackModal
        open={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          resetFeedback();
        }}
        state={{
          fbName,
          setFbName,
          fbMsg,
          setFbMsg,
          fbLoading,
          fbError,
          fbSuccess,
          honey,
          setHoney,
        }}
        onSubmit={submitFeedback}
      />
    </footer>
  );
}