"use client";

import { useState } from "react";

export default function AdminLogin({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASS || "garage07"; // ✅ ENV эсвэл fallback
    if (password === correctPassword) {
      onLoginSuccess();
    } else {
      setError("Нууц үг буруу байна!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0d] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#151518] p-8 rounded-xl border border-gray-700 w-80"
      >
        <h2 className="text-xl font-bold text-[#a7ffea] mb-4 text-center">
          Admin Login
        </h2>
        <input
          type="password"
          placeholder="Нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 bg-black border border-gray-700 rounded-md mb-3"
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-[#a7ffea] text-black font-semibold py-2 rounded-md hover:bg-[#8cf6db]"
        >
          Нэвтрэх
        </button>
      </form>
    </div>
  );
}
