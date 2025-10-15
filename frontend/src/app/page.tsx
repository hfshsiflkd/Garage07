"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion"; // ← нэмэхээ мартуузай
import { ChevronLeft, ChevronRight } from "lucide-react"; // ← сумны icon

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
  const [activeCategory, setActiveCategory] = useState<string>("Salad");

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  

  const menu: MenuCategory[] = [
    {
      category: "Salad",
      items: [
        {
          name: "Chicken ceasar",
          price: "₮23,500",
          desc: "Ice berg, chicken, parmesan",
          img: "/hool/ceasar.jpg",
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
          price: "₮32,000",
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
          price: "₮19,900",
          desc: "chicken, vegetables, udon noodles",
          img: "/hool/yaki-udon-udon-noodle-stir-fry-9.jpg",
        },
        {
          name: "Teriyaki chicken bowl",
          price: "₮21,900",
          desc: "chicken, vegetables, udon noodles",
          img: "/hool/Teriyaki-chicken-bowl-feature.webp",
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
          name: "Chicken soup",
          price: "₮29,500",
          desc: "Whole chicken, vegetables, cream",
          img: "/hool/Chicken_soup.jpg",
        },
      ],
    },
    {
      category: "Pasta & Steak",
      items: [
        {
          name: "Carbonara spaghetti",
          price: "₮26,500",
          desc: "Bacon, egg yolk, parmesan",
          img: "/hool/CB.jpg",
        },
        {
          name: "meatball spaghetti",
          price: "₮28,500",
          desc: "Beef meatball, tomato sauce, parmesan",
          img: "/hool/mt.jpeg",
        },
        {
          name: "Salmon steak",
          price: "₮32,500",
          desc: "Salmon, asparagus, lemon, broccli,  pumpkin, purée",
          img: "/hool/mt.jpeg",
        },
      ],
    },
    {
      category: "Pizza",
      items: [
        {
          name: "Meat lovers 13inch",
          price: "₮29,000",
          desc: "Chicken ,bacon, vegetables, mozzarella, tomato sauce",
          img: "/hool/oizza mt l.avif",
        },
        {
          name: "Jalapeno pepperoni 13inch",
          price: "₮28,500",
          desc: "Pepperoni, jalapeno, mozzarella , tomato sauce",
          img: "/hool/Pizza_JP.png",
        },
        {
          name: "pepperoni 13inch",
          price: "₮27,000",
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
          price: "₮10,500",
          desc: "with ketchup",
          img: "/hool/Fries.jpg",
        },
        {
          name: "Homemade potato wedges",
          price: "₮9,500",
          desc: "ketchup, ranch sauce",
          img: "/hool/Potato-Wedges1.jpg",
        },
        {
          name: "steamed rice",
          price: "₮2,000",
          desc: "seasame seeds",
          img: "/hool/Rice.jpeg",
        },
      ],
    },
    {
      category: "Beer & Drinks",
      items: [
        {
          name: "Cass 500ml",
          price: "₮10,000",
          desc: "Korea's No.1 beer",
          img: "/hool/Bear & Soda/Cass 500ml.webp",
        },
        {
          name: "Soju 360ml",
          price: "₮15,000",
          desc: "Korea's No.1 spirit",
          img: "/hool/Bear & Soda/Soju 360ml.jpg",
        },
        {
          name: "TSINGTAO 500ml",
          price: "₮10,000",
          desc: "China's No.1 beer",
          img: "/hool/Bear & Soda/TSINGTAO 500ml.jpeg",
        },
        {
          name: "Terra 500ml",
          price: "₮10,000",
          desc: "Korea's No.2 beer",
          img: "/hool/Bear & Soda/Terra 500ml.webp",
        },
      ],
    },
    {
      category: "Water & Soft Drinks",
      items: [
        {
          name: "Sprite 330ml",
          price: "₮6,000",
          desc: "Lemon lime soda",
          img: "/hool/Bear & Soda/Sprite 330ml.avif",
        },
        {
          name: "Coca-Cola 330ml",
          price: "₮6,000",
          desc: "Classic Coke",
          img: "/hool/Bear & Soda/Coca-Cola 330ml.webp",
        },
        {
          name: "Fanta 500ml",
          price: "₮3,000",
          desc: "Orange soda",
          img: "/hool/Bear & Soda/fanta-500ml.png",
        },
        {
          name: "Coca Cola 500ml",
          price: "₮3,000",
          desc: "Classic Coke",
          img: "/hool/Bear & Soda/Coca-Cola 500ml.webp",
        },
        {
          name: "Bonaqua 500ml",
          price: "₮2,500",
          desc: "Mineral water",
          img: "/hool/Bear & Soda/Bonaqua 500ml.webp",
        },
        {
          name: "Ooha 500ml",
          price: "₮2,500",
          desc: "Mineral water",
          img: "/hool/Bear & Soda/Ooha 500ml.jpg",
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

        <div className="relative w-full mb-4 flex-shrink-0">
          {/* Scrollable list */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide flex space-x-3 px-10 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {menu.map((cat) => (
              <motion.button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                whileTap={{ scale: 0.95 }}
                whileHover={{
                  scale: 1.08,
                  backgroundColor:
                    activeCategory === cat.category
                      ? "#a7ffea"
                      : "rgba(167,255,234,0.08)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm font-semibold transition-all
          ${
            activeCategory === cat.category
              ? "bg-[#a7ffea] text-black border-[#a7ffea]"
              : "bg-transparent text-[#a7ffea]/80 border-[#a7ffea]/40"
          }`}
              >
                {cat.category}
              </motion.button>
            ))}
          </div>

          {/* Left Arrow */}
          <button
            onClick={() => scrollBy(-150)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full z-10 backdrop-blur-sm transition"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollBy(150)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full z-10 backdrop-blur-sm transition"
          >
            <ChevronRight size={18} />
          </button>

          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#0b0b0d] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#0b0b0d] to-transparent" />

          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
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
