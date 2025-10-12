"use client";
import React, { useState } from "react";
import Image from "next/image";

type MenuItem = {
  name: string;
  price: string;
  desc: string;
  img: string;
};

type MenuCategory = {
  category: string;
  items: MenuItem[];
};

export default function Garage07QRMenu() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Salats");

  const menu: MenuCategory[] = [
    {
      category: "Salad",
      items: [
        {
          name: "Chiken ceasar",
          price: "₮23,500",
          desc: "Ice berg, chicken, parmesan",
          img: "/hool/ceasar.jpg",
        },
        {
          name: "Balsamic rocket",
          price: "₮22,000",
          desc: "balsamic vinegar, rocket, parmesan",
          img: "/hool/rocket_salad_final_1.jpg",
        },
        {
          name: "Asian smashed cucumber",
          price: "₮16,500",
          desc: "cucumber, sesame oil, soy sauce",
          img: "/hool/asian_cucumber.jpg",
        },
      ],
    },
    {
      category: "Main",
      items: [
        {
          name: "Beef broccoli - 2per",
          price: "₮28,000",
          desc: "Beef, broccoli, sesame sauce ",
          img: "/hool/beef broccoli.jpeg",
        },
        {
          name: "Beef Curry",
          price: "₮21,500",
          desc: "Beef,curry sauce,rice",
          img: "/hool/Coconut-Beef-Curry-3.webp",
        },
        {
          name: "Chicken curry",
          price: "₮15,500",
          desc: "Chicken,curry sauce,rice",
          img: "/hool/Chicken_curry.jpg",
        },
        {
          name: "Өвчүүний цуйван ",
          price: "₮21,500",
          desc: "brisket, vegetables, handmade flour",
          img: "/hool/steak.jpg",
        },
        {
          name: "Stir fried udon ",
          price: "₮20,000",
          desc: "beef, vegetables, udon noodles",
          img: "/hool/yaki-udon-udon-noodle-stir-fry-9.jpg",
        },
      ],
    },
    {
      category: "Soup",
      items: [
        {
          name: "Хунчиртай тойгны шөл - 2per",
          price: "₮32,500",
          desc: "Beef bone, vegetables,",
          img: "/hool/steak.jpg",
        },
        {
          name: "Egg drop soup",
          price: "₮15,000",
          desc: "Egg, chicken broth, scallions",
          img: "/hool/egg-drop-soup-11.webp",
        },
        {
          name: "Pumpkin soup",
          price: "₮17,000",
          desc: "Pumpkin, cream, vegetables",
          img: "/hool/Roasted-Butternut-Squash-Soup-TIMG.jpg",
        },
        {
          name: "Chiken soup",
          price: "₮29,500",
          desc: "Whole chiken, vegetables, cream",
          img: "/hool/Chicken_soup.jpg",
        },
      ],
    },
    {
      category: "Pasta",
      items: [
        {
          name: "Carbonara pasta",
          price: "₮26,500",
          desc: "Bacon, egg yolk, parmesan",
          img: "/hool/CB.jpg",
        },
        {
          name: "Salmon pestp spaghetti",
          price: "₮32,000",
          desc: "Salmon, pesto sauce, parmesan",
          img: "/hool/steak.jpg",
        },
        {
          name: "meatball spaghetti",
          price: "₮28,500",
          desc: "Beef meatball, tomato sauce, parmesan",
          img: "/hool/mt.jpeg",
        },
      ],
    },
    {
      category: "Pizza",
      items: [
        {
          name: "Meat lovers 13inch",
          price: "₮27,500",
          desc: "Chicken ,bacon, vegetables, mozzarella, tomato sauce",
          img: "/hool/oizza mt l.avif",
        },
        {
          name: "Jalapeno pepperoni 13inch",
          price: "₮26,500",
          desc: "Pepperoni, jalapeno, mozzarella , tomato sauce",
          img: "/hool/Pizza_JP.png",
        },
        {
          name: "pepperoni 13inch",
          price: "₮25,500",
          desc: "Pepperoni, mozzarella, tomato sauce",
          img: "/hool/Pizza_13inch.jpg",
        },
      ],
    },
    {
      category: "Fries & Sides",
      items: [
        {
          name: "french fries",
          price: "₮12,500",
          desc: "with ketchup",
          img: "/hool/Fries.jpg",
        },
        {
          name: "Homemade potato wedges",
          price: "₮11,500",
          desc: "ketchup, ranch sauce",
          img: "/hool/Potato-Wedges1.jpg",
        },
        {
          name: "steamed rice",
          price: "₮2000",
          desc: "seasame seeds",
          img: "/hool/Rice.jpeg",
        },
      ],
    },
  ];

  const activeItems =
    menu.find((cat) => cat.category === activeCategory)?.items || [];

  return (
    <div
      className="min-h-screen text-white antialiased p-4 flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/hool/black-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="w-full max-w-md h-[90vh] bg-gradient-to-b from-[#0b0b0d]/80 via-[#0b0b0d]/60 to-[#0b0b0d]/80 rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center">
            <Image
              src="/hool/obud-file.png"
              alt="Garage07 Logo"
              width={120}
              height={120}
              className="object-cover"
            />
            <div className="ml-2">
              <h1
                className="text-3xl font-extrabold tracking-wide mb-1"
                style={{ textShadow: "0 2px 10px rgba(109, 41, 255, .18)" }}
              >
                Garage
              </h1>
              <p className="text-xs text-gray-300 -mt-1">
                Wheel • Good music • Late nights
              </p>
            </div>
          </div>
        </header>

        {/* CATEGORY BAR */}
        <div
          className="w-full mb-4 overflow-x-auto scrollbar-hide flex-shrink-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex space-x-3 px-6">
            {menu.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold transition-all
                ${
                  activeCategory === cat.category
                    ? "bg-[#a7ffea] text-black border-[#a7ffea]"
                    : "bg-transparent text-[#a7ffea]/80 border-[#a7ffea]/40 hover:text-white"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Chrome, Safari */
            }
          `}</style>
        </div>

        {/* MENU ITEMS */}
        <section className="flex-1 overflow-y-auto pr-2">
          <ul className="space-y-3">
            {activeItems.map((it) => (
              <li
                key={it.name}
                onClick={() => setSelectedItem(it)}
                className="bg-gradient-to-r from-[#0b0b0d]/60 to-[#0b0b0d]/40 p-3 rounded-lg border border-white/5 flex items-start justify-between cursor-pointer hover:bg-[#101015]/80 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[60px] h-[60px] overflow-hidden rounded-lg flex-shrink-0">
                    <Image
                      src={it.img}
                      alt={it.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{it.name}</h3>
                    <p className="text-xs text-gray-400 truncate w-30 h-5">
                      {it.desc}
                    </p>
                  </div>
                </div>
                <div className="text-right font-semibold">{it.price}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-4 flex items-center justify-between flex-shrink-0">
          <div />
          <div className="text-xs text-gray-400">Open: 12:00 — 00:00</div>
        </footer>
      </main>

      {/* MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#0b0b0d] rounded-2xl p-5 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-end mb-2">
              <button
                className=" text-gray-400 hover:text-white text-xl font-bold"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </button>
            </div>
            <Image
              src={selectedItem.img}
              alt={selectedItem.name}
              width={400}
              height={250}
              className="rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
            <p className="text-sm text-gray-300 mb-4">{selectedItem.desc}</p>
            <div className="text-right font-semibold text-[#a7ffea] text-lg">
              {selectedItem.price}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
