"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

// 1. Dodajemy interfejs opisujący dane piosenki z Deezera
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

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: DeezerTrack;
}

export default function ReviewModal({ isOpen, onClose, track }: ReviewModalProps) {
  // Stany komponentu
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Jeśli modal jest "zamknięty", w ogóle go nie renderujemy
  if (!isOpen) return null;

  // Funkcja wysyłająca recenzję do bazy Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating (stars)!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // 1. Sprawdzamy, czy użytkownik jest na pewno zalogowany
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError("You must be logged in to leave a review.");
      setIsSubmitting(false);
      return;
    }

    // 2. Zapisujemy dane do naszej nowej tabeli "reviews"
    const { error: dbError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        item_id: track.id.toString(),
        item_type: "song",
        rating: rating,
        review_text: reviewText,
        item_title: track.title,
        item_artist: track.artist.name,
        item_cover: track.album.cover_medium,
        item_album: track.album.title
      });

    if (dbError) {
      console.error(dbError);
      setError("Something went wrong. Try again.");
    } else {
      setSuccess(true);
      // Opcjonalnie zamykamy okienko po 2 sekundach
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }
    
    setIsSubmitting(false);
  };

  return (
    // Tło przyciemniające resztę strony
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      
      {/* Główne okienko */}
      <div className="bg-[#050A15] border border-effect/50 p-6 w-full max-w-2xl flex flex-col relative">
        
        {/* Przycisk zamykania "X" */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text/50 hover:text-effect transition-colors font-orbitron text-[20px]"
        >
          X
        </button>

        <h2 className="font-orbitron font-bold text-[24px] text-text uppercase mb-6">
          I Watched... / I Listened...
        </h2>

        {/* Informacje o piosence (miniaturka, tytuł) */}
        <div className="flex gap-4 mb-6 p-4 bg-effect/5 border border-effect/20">
          <div className="relative w-16 h-16 border border-brand/30 shrink-0">
            <Image 
              src={track?.album?.cover_medium || "/hero-image.jpg"} 
              alt="Cover" 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-orbitron font-bold text-[18px] text-text">{track?.title}</h3>
            <p className="font-orbit text-[14px] text-text/70">{track?.artist?.name}</p>
          </div>
        </div>

        {/* Formularz lub komunikat o sukcesie */}
        {success ? (
          <div className="py-10 text-center">
            <h3 className="font-orbitron text-brand text-[20px] mb-2">Review Logged!</h3>
            <p className="font-orbit text-text/80">Your rating has been saved to your profile.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Mechanika Gwiazdek */}
            <div className="flex flex-col gap-2">
              <label className="font-orbit text-[14px] text-text uppercase tracking-wide">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || rating) ? "text-effect" : "text-text/20"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Pole Tekstowe (Recenzja) */}
            <div className="flex flex-col gap-2">
              <label className="font-orbit text-[14px] text-text uppercase tracking-wide">
                Review (Optional)
              </label>
              <textarea 
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full bg-transparent border border-effect/40 rounded-sm p-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30 resize-none"
              />
            </div>

            {error && <p className="text-red-500 font-orbit text-[14px]">{error}</p>}

            {/* Przycisk zapisu */}
            <div className="flex justify-end mt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="h-12 px-8 bg-brand hover:bg-brand/80 disabled:bg-brand/50 disabled:cursor-not-allowed text-white font-orbitron font-bold text-[16px] transition-all uppercase"
              >
                {isSubmitting ? "Saving..." : "Save Review"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}