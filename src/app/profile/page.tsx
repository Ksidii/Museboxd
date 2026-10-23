"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Interfejs recenzji z bazy danych
interface Review {
  id: string;
  item_id: string;
  item_type: string;
  rating: number;
  review_text: string;
  item_title: string;
  item_artist: string;
  item_cover: string;
  item_album: string;
  created_at: string;
}

// Komponent gwiazdek (z Twojego kodu)
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 text-effect">
    {[...Array(5)].map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "transparent"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ))}
  </div>
);

export default function ProfilePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState<string>("Loading...");
  const [joinDate, setJoinDate] = useState<string>("");

  useEffect(() => {
    async function fetchProfileData() {
      // 1. Pobieramy użytkownika
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUsername(user.user_metadata?.username || "Unknown User");
        
        // Formatowanie daty dołączenia (np. 28.03.2026)
        const date = new Date(user.created_at);
        setJoinDate(`${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`);

        // 2. Pobieramy recenzje z bazy
        const { data: reviewsData, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && reviewsData) {
          setReviews(reviewsData);
        }
      }
    }

    fetchProfileData();
  }, []);

  // Rozdzielamy recenzje
  const songReviews = reviews.filter((r) => r.item_type === "song");
  const albumReviews = reviews.filter((r) => r.item_type === "album");

  return (
    <div className="w-full flex flex-col items-center pb-20">
      
      {/* === BANNER & AVATAR === */}
      <div className="w-full max-w-360 flex flex-col items-center">
        
        {/* Banner */}
        <div className="w-full h-40 md:h-64 relative overflow-hidden">
          <Image src="/hero-image.jpg" alt="Profile Banner" fill className="object-cover" />
          <div className="absolute inset-0 bg-brand/30"></div> {/* Lekkie przyciemnienie */}
        </div>
        
        {/* Informacje o użytkowniku */}
        <div className="w-full max-w-266.25 flex items-end px-4 md:px-0 -mt-12 md:-mt-16 relative z-10 mb-12">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-brand overflow-hidden relative bg-brand">
            <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
          </div>
          <div className="ml-5 pb-2">
            <h1 className="font-orbitron font-bold text-[24px] md:text-[32px] text-text leading-none">
              {username}
            </h1>
            <p className="font-orbit text-[12px] md:text-[14px] text-text/70 mt-1">
              Joined: {joinDate || "..."}
            </p>
          </div>
        </div>
      </div>

      {/* === SEKCJE Z TREŚCIĄ === */}
      <div className="w-full max-w-266.25 flex flex-col gap-12 px-4 md:px-0">
        
        {/* RECENTLY RATED SONGS & ALBUMS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Songs Column */}
          <div className="flex flex-col w-full">
            <div className="w-full mb-4">
              <h2 className="font-orbitron font-bold text-[16px] text-text uppercase mb-1">
                RECENTLY RATED SONGS
              </h2>
              <div className="w-full h-px bg-text/50"></div>
            </div>

            <div className="flex flex-col gap-3">
              {songReviews.length > 0 ? (
                songReviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="w-full bg-[#E5F4FA] text-brand relative border border-effect p-3 flex gap-3 h-28">
                    <div className="relative w-20 h-20 shrink-0 border border-brand/20">
                      <Image src={review.item_cover || "/hero-image.jpg"} alt="Cover" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-orbitron font-bold text-[14px] underline decoration-brand underline-offset-2 truncate max-w-37.5">
                            {review.item_title}
                          </h3>
                          {review.item_album && (
                            <p className="font-orbit text-[10px] truncate max-w-37.5">from {review.item_album}</p>
                          )}
                        </div>
                        <p className="font-orbit text-[10px] text-right truncate max-w-25">by {review.item_artist}</p>
                      </div>
                      
                      {review.review_text && (
                        <p className="font-orbitron text-[14px] text-center italic mt-1 truncate">
                          &quot;{review.review_text}&quot;
                        </p>
                      )}
                      
                      <div className="flex justify-between items-end mt-auto">
                        <div className="flex items-center gap-1">
                          <div className="relative w-4 h-4 rounded-full overflow-hidden">
                            <Image src="/avatar.jpg" alt="User" fill className="object-cover" />
                          </div>
                          <span className="font-orbitron font-semibold text-[10px]">{username}</span>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-orbit text-[12px] text-text/50">No songs rated yet.</p>
              )}
            </div>
            <Link href="/reviews/songs" className="font-orbit text-[12px] text-text/70 underline underline-offset-2 hover:text-effect transition-colors mt-3 text-center">
              See all reviews...
            </Link>
          </div>

          {/* Albums Column */}
          <div className="flex flex-col w-full">
            <div className="w-full mb-4">
              <h2 className="font-orbitron font-bold text-[16px] text-text uppercase mb-1">
                RECENTLY RATED ALBUMS
              </h2>
              <div className="w-full h-px bg-text/50"></div>
            </div>

            <div className="flex flex-col gap-3">
              {albumReviews.length > 0 ? (
                albumReviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="w-full bg-[#E5F4FA] text-brand relative border border-effect p-3 flex gap-3 h-28">
                    <div className="relative w-20 h-20 shrink-0 border border-brand/20">
                      <Image src={review.item_cover || "/hero-image.jpg"} alt="Cover" fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-between grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-orbitron font-bold text-[14px] underline decoration-brand underline-offset-2 truncate max-w-37.5">
                            {review.item_title}
                          </h3>
                        </div>
                        <p className="font-orbit text-[10px] text-right truncate max-w-25">by {review.item_artist}</p>
                      </div>
                      
                      {review.review_text && (
                        <p className="font-orbitron text-[14px] text-center italic mt-1 truncate">
                          &quot;{review.review_text}&quot;
                        </p>
                      )}
                      
                      <div className="flex justify-between items-end mt-auto">
                        <div className="flex items-center gap-1">
                          <div className="relative w-4 h-4 rounded-full overflow-hidden">
                            <Image src="/avatar.jpg" alt="User" fill className="object-cover" />
                          </div>
                          <span className="font-orbitron font-semibold text-[10px]">{username}</span>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-orbit text-[12px] text-text/50">No albums rated yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* TOP ALBUMS */}
        <div className="flex flex-col w-full">
          <div className="w-full mb-4">
            <h2 className="font-orbitron font-bold text-[16px] text-text uppercase mb-1">TOP ALBUMS</h2>
            <div className="w-full h-px bg-text/50"></div>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="relative w-40 h-40 border border-effect"><Image src="/hero-image.jpg" alt="Album" fill className="object-cover" /></div>
            <div className="relative w-40 h-40 border border-effect"><Image src="/hero-image.jpg" alt="Album" fill className="object-cover" /></div>
          </div>
          <Link href="/top/albums" className="font-orbit text-[12px] text-text/70 underline underline-offset-2 hover:text-effect transition-colors mt-1">
            More albums...
          </Link>
        </div>

        {/* TOP ARTISTS */}
        <div className="flex flex-col w-full">
          <div className="w-full mb-4">
            <h2 className="font-orbitron font-bold text-[16px] text-text uppercase mb-1">TOP ARTISTS</h2>
            <div className="w-full h-px bg-text/50"></div>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="relative w-40 h-40 border border-effect"><Image src="/hero-image.jpg" alt="Artist" fill className="object-cover" /></div>
            <div className="relative w-40 h-40 border border-effect"><Image src="/hero-image.jpg" alt="Artist" fill className="object-cover" /></div>
          </div>
          <Link href="/top/artists" className="font-orbit text-[12px] text-text/70 underline underline-offset-2 hover:text-effect transition-colors mt-1">
            More artists...
          </Link>
        </div>

        {/* TOP TRACKS */}
        <div className="flex flex-col w-full">
          <div className="w-full mb-4">
            <h2 className="font-orbitron font-bold text-[16px] text-text uppercase mb-1">TOP TRACKS</h2>
            <div className="w-full h-px bg-text/50"></div>
          </div>
          <div className="flex flex-col gap-2 bg-[#E5F4FA] p-4 text-brand">
            {[1, 2, 3, 4, 5].map((track) => (
              <div key={track} className="flex justify-between items-center border-b border-brand/20 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
                <p className="font-orbitron text-[12px]"><span className="font-bold">{track}</span> &nbsp; Sleepwalking <span className="font-orbit text-[10px]">by Bring Me the Horizon</span></p>
                <div className="flex items-center gap-4">
                  <p className="font-orbit text-[10px]">Album: <span className="font-bold">Sempiternal</span></p>
                  <div className="relative w-6 h-6 border border-brand/50"><Image src="/hero-image.jpg" alt="Cover" fill className="object-cover" /></div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/top/tracks" className="font-orbit text-[12px] text-text/70 underline underline-offset-2 hover:text-effect transition-colors mt-3 text-center">
            More tracks...
          </Link>
        </div>

      </div>
    </div>
  );
}