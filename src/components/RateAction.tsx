"use client";

import { useState } from "react";
import ReviewModal from "./ReviewModal";

// Definiujemy interfejs, żeby TypeScript dokładnie wiedział, co przekazujemy
interface DeezerTrack {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_medium: string;
  };
}

export default function RateAction({ track }: { track: DeezerTrack }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="h-12 px-8 bg-brand hover:bg-brand/80 text-white font-orbitron font-bold text-[16px] transition-all uppercase rounded-sm shadow-md shadow-brand/20 hover:shadow-brand/40"
      >
        Rate & Review
      </button>

      {/* Nasze okienko z gwiazdkami, ukryte dopóki isModalOpen = false */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={track}
      />
    </>
  );
}