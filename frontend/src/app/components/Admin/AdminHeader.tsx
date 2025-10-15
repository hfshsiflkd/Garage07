"use client";

export default function AdminHeader() {
  return (
    <header className="flex justify-between items-center border-b border-gray-700 pb-4">
      <h1 className="text-2xl font-bold text-[#a7ffea]">Garage07 Admin</h1>
      <button
        onClick={() => (window.location.href = "/")}
        className="text-sm px-3 py-1 border border-gray-600 rounded-md hover:bg-gray-800 transition"
      >
        View Menu
      </button>
    </header>
  );
}
