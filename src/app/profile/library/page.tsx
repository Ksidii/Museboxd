"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  item_id: string;
  item_type: "song" | "album";
  rating: number;
  review_text: string;
  item_title: string;
  item_artist: string;
  item_cover: string;
  item_album: string | null;
  created_at: string;
}

type TabType = "reviews" | "albums" | "artists" | "tracks";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 text-effect">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill={i < rating ? "currentColor" : "transparent"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ))}
  </div>
);

function ProfileLibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab") as TabType | null;
  const validTabs: TabType[] = ["reviews", "albums", "artists", "tracks"];
  const activeTab: TabType = tabParam && validTabs.includes(tabParam) ? tabParam : "reviews";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLibraryData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUsername(user.user_metadata?.username || "Unknown User");

        const { data: reviewsData, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && reviewsData) {
          setReviews(reviewsData as Review[]);
        }
      }
      setLoading(false);
    }

    fetchLibraryData();
  }, []);

  const handleTabChange = (tab: TabType) => {
    router.push(`/profile/library?tab=${tab}`, { scroll: false });
  };

  // Pełne listy 
  const allAlbums = reviews
    .filter((r) => r.item_type === "album")
    .sort((a, b) => b.rating - a.rating);

  const allTracks = reviews
    .filter((r) => r.item_type === "song")
    .sort((a, b) => b.rating - a.rating);

  const artistStats = reviews
    .filter((r) => r.rating >= 4)
    .reduce<Record<string, { name: string; count: number; totalScore: number; cover: string }>>(
      (acc, review) => {
        const artistName = review.item_artist;
        if (!acc[artistName]) {
          acc[artistName] = {
            name: artistName,
            count: 0,
            totalScore: 0,
            cover: review.item_cover || "/hero-image.jpg",
          };
        }
        acc[artistName].count += 1;
        acc[artistName].totalScore += review.rating;
        return acc;
      },
      {}
    );

  const allArtists = Object.values(artistStats).sort(
    (a, b) => b.count - a.count || b.totalScore - a.totalScore
  );

  const tabs: { id: TabType; label: string }[] = [
    { id: "reviews", label: "Reviews" },
    { id: "albums", label: "Albums" },
    { id: "artists", label: "Artists" },
    { id: "tracks", label: "Tracks" },
  ];

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col gap-8">
        
        {/* Powrót do profilu */}
        <Link
          href="/profile"
          className="font-orbit text-[14px] text-text/60 hover:text-effect transition-colors w-fit"
        >
          &lt; Back to Profile
        </Link>

        {/* Nagłówek */}
        <div>
          <h1 className="font-orbitron font-bold text-[28px] md:text-[36px] text-text uppercase">
            {username}&apos;s Library
          </h1>
        </div>

        {/* === 4 ZAKŁADKI OBOK SIEBIE === */}
        <div className="flex border-b border-text/30 gap-6 md:gap-10 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-3 font-orbitron font-bold text-[14px] md:text-[16px] uppercase transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                  isActive
                    ? "border-effect text-effect"
                    : "border-transparent text-text/60 hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* === ZAWARTOŚĆ ZAKŁADEK === */}
        {loading ? (
          <p className="font-orbit text-[14px] text-text/60">Loading your library...</p>
        ) : (
          <div className="w-full">
            
            {/* ZAKŁADKA 1: REVIEWS */}
            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Link
                      key={review.id}
                      href={review.item_type === "album" ? `/albums/${review.item_id}` : `/songs/${review.item_id}`}
                      className="w-full bg-[#E5F4FA] text-brand relative border border-effect p-3 flex gap-3 h-28 hover:brightness-95 transition-all"
                    >
                      <div className="relative w-20 h-20 shrink-0 border border-brand/20">
                        <Image
                          src={review.item_cover || "/hero-image.jpg"}
                          alt={review.item_title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between grow min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h3 className="font-orbitron font-bold text-[14px] underline decoration-brand underline-offset-2 truncate">
                              {review.item_title}
                            </h3>
                            <p className="font-orbit text-[10px] truncate">
                              {review.item_type === "song" && review.item_album
                                ? `from ${review.item_album}`
                                : "Album"}
                            </p>
                          </div>
                          <p className="font-orbit text-[10px] text-right shrink-0 max-w-27.5 truncate">
                            by {review.item_artist}
                          </p>
                        </div>

                        {review.review_text && (
                          <p className="font-orbitron text-[13px] text-center italic mt-1 truncate">
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
                    </Link>
                  ))
                ) : (
                  <p className="font-orbit text-[14px] text-text/50">No reviews yet.</p>
                )}
              </div>
            )}

            {/* ZAKŁADKA 2: ALBUMS */}
            {activeTab === "albums" && (
              <div>
                {allAlbums.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {allAlbums.map((album) => (
                      <Link
                        key={album.id}
                        href={`/albums/${album.item_id}`}
                        className="relative w-40 h-40 border border-effect overflow-hidden group"
                        title={`${album.item_title} (${album.rating}/5)`}
                      >
                        <Image
                          src={album.item_cover || "/hero-image.jpg"}
                          alt={album.item_title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-brand/85 px-2 py-1 border-t border-effect/30">
                          <p className="font-orbitron text-[10px] text-text truncate">{album.item_title}</p>
                          <p className="font-orbit text-[10px] text-effect">★ {album.rating}/5</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="font-orbit text-[14px] text-text/50">No rated albums yet.</p>
                )}
              </div>
            )}

            {/* ZAKŁADKA 3: ARTISTS */}
            {activeTab === "artists" && (
              <div>
                {allArtists.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {allArtists.map((artist) => (
                      <div
                        key={artist.name}
                        className="relative w-40 h-40 border border-effect overflow-hidden group"
                      >
                        <Image
                          src={artist.cover}
                          alt={artist.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-brand/85 p-2 border-t border-effect/30">
                          <p className="font-orbitron font-bold text-[11px] text-text truncate">
                            {artist.name}
                          </p>
                          <p className="font-orbit text-[10px] text-effect">
                            {artist.count} positive {artist.count === 1 ? "rating" : "ratings"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-orbit text-[14px] text-text/50">
                    Give 4 or 5 stars to songs and albums to see your artists here.
                  </p>
                )}
              </div>
            )}

            {/* ZAKŁADKA 4: TRACKS */}
            {activeTab === "tracks" && (
              <div>
                {allTracks.length > 0 ? (
                  <div className="flex flex-col gap-2 bg-[#E5F4FA] p-4 text-brand">
                    {allTracks.map((track, index) => (
                      <Link
                        key={track.id}
                        href={`/songs/${track.item_id}`}
                        className="flex justify-between items-center border-b border-brand/20 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0 hover:bg-effect/10 transition-colors px-1"
                      >
                        <p className="font-orbitron text-[12px] truncate pr-4">
                          <span className="font-bold">{index + 1}</span> &nbsp; {track.item_title}{" "}
                          <span className="font-orbit text-[10px]">by {track.item_artist}</span>
                        </p>
                        <div className="flex items-center gap-4 shrink-0">
                          {track.item_album && (
                            <p className="font-orbit text-[10px] hidden sm:block">
                              Album: <span className="font-bold">{track.item_album}</span>
                            </p>
                          )}
                          <span className="font-orbitron font-bold text-[11px] text-mark">
                            ★ {track.rating}
                          </span>
                          <div className="relative w-6 h-6 border border-brand/50 shrink-0">
                            <Image
                              src={track.item_cover || "/hero-image.jpg"}
                              alt={track.item_title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="font-orbit text-[14px] text-text/50">No rated tracks yet.</p>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfileLibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center font-orbit text-text">
          Loading...
        </div>
      }
    >
      <ProfileLibraryContent />
    </Suspense>
  );
}