"use client";

import { useState } from "react";
import ReviewModal, { ReviewItem } from "./ReviewModal";

export default function RateAction({ item }: { item: ReviewItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="h-12 px-8 bg-brand hover:text-effect text-white font-orbitron font-bold text-[16px] uppercase rounded-sm border border-effect/40 hover:border-effect transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95"
      >
        Rate & Review
      </button>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
      />
    </>
  );
}