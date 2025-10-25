"use client";
import { useState, useEffect } from "react";
import { useCurrency } from "@/app/context/CurrencyContext";
import { DollarSign, RotateCcw } from "lucide-react";

export default function ExchangeRateControl() {
  const { rateMntPerUsd, setRateMntPerUsd, resetToDefault } = useCurrency();
  const [val, setVal] = useState<string>(String(rateMntPerUsd));
  const [dirty, setDirty] = useState(false);

  // context өөрчлөгдвөл input-тэйгээ sync
  useEffect(() => {
    if (!dirty) setVal(String(rateMntPerUsd));
  }, [rateMntPerUsd, dirty]);

  const apply = () => {
    const n = Number(val);
    if (!Number.isFinite(n) || n <= 0) {
      alert("Ханш буруу. Эерэг тоо оруулна уу.");
      return;
    }
    setDirty(false);
    setRateMntPerUsd(n);
  };

  return (
    <div className="flex items-center gap-2 bg-[#151518] border border-gray-700 rounded-lg px-3 py-2">
      <DollarSign className="text-[#a7ffea]" size={18} />
      <span className="text-sm text-gray-300 whitespace-nowrap">1 USD =</span>
      <input
        type="number"
        inputMode="numeric"
        value={val}
        onChange={(e) => {
          setDirty(true);
          setVal(e.target.value);
        }}
        className="w-24 text-center bg-black border border-gray-700 rounded-md text-sm px-1 py-1 text-white focus:ring-1 focus:ring-[#a7ffea]"
        min={1000}
        step="10"
      />
      <span className="text-sm text-gray-400">₮</span>

      <button
        onClick={apply}
        disabled={!dirty}
        className={`ml-2 text-sm px-2 py-1 rounded-md border ${
          dirty
            ? "bg-[#a7ffea] text-black border-[#a7ffea] hover:bg-[#8cf6db]"
            : "bg-white/5 border-white/10 text-white/60 cursor-not-allowed"
        }`}
        title="Ханш шинэчлэх"
      >
        Хадгалах
      </button>

      <button
        onClick={() => {
          resetToDefault();
          setDirty(false);
        }}
        className="ml-1 p-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10"
        title="DEFAULT руу буцаах"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}
