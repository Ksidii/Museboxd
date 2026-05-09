import Image from "next/image";
import Link from "next/link";

// ==========================================
// 1. DANE TESTOWE (MOCK DATA)
// ==========================================

const newReleasesAlbums = [
  { id: 1, title: "Sempiternal", coverUrl: "/sempiternal.jpg" },
  { id: 2, title: "In Rainbows", coverUrl: "/in-rainbows.jpg" },
  { id: 3, title: "AM", coverUrl: "/am.jpg" },
  { id: 4, title: "amo", coverUrl: "/amo.jpg" },
  { id: 5, title: "Suicide Season", coverUrl: "/suicide-season.jpg" },
  { id: 6, title: "Steal This Album", coverUrl: "/steal-this-album.jpg" },
];

const songReviews = [
  { id: 1, title: "Can You Feel My Heart", album: "Sempiternal", artist: "Bring Me The Horizon", quote: "This song is amazing!", user: "User 123", rating: 5, coverUrl: "/sempiternal.jpg", avatarUrl: "/avatar.jpg" },
  { id: 2, title: "MANTRA", album: "amo", artist: "Bring Me The Horizon", quote: "This song is catchy but idk...", user: "User 123", rating: 3, coverUrl: "/amo.jpg", avatarUrl: "/avatar.jpg" },
  { id: 3, title: "Innervision", album: "Steal This Album", artist: "System of a Down", quote: "This song is amazing!", user: "User 123", rating: 5, coverUrl: "/steal-this-album.jpg", avatarUrl: "/avatar.jpg" },
];

const albumReviews = [
  { id: 1, title: "Sempiternal", artist: "Bring Me The Horizon", quote: "This album changed my life!", user: "User 123", rating: 6, coverUrl: "/sempiternal.jpg", avatarUrl: "/avatar.jpg" },
  { id: 2, title: "AM", artist: "Arctic Monkeys", quote: "This album is amazing!", user: "User 123", rating: 4, coverUrl: "/am.jpg", avatarUrl: "/avatar.jpg" },
  { id: 3, title: "In Rainbows", artist: "Radiohead", quote: "WOW! A masterpiece.", user: "User 123", rating: 6, coverUrl: "/in-rainbows.jpg", avatarUrl: "/avatar.jpg" },
];

// ==========================================
// 2. KOMPONENT GWIAZDEK
// ==========================================
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 text-effect">
      {[...Array(6)].map((_, i) => (
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" height="16" 
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
};

// ==========================================
// 3. GŁÓWNA STRONA
// ==========================================
export default function Home() {
  return (
    <div className="w-full flex flex-col items-center pt-17 pb-17 px-4 gap-17">
      
      {/* --- SEKCJA 1: HERO --- */}
      <section className="flex flex-col items-center w-full max-w-266.25">
        <div className="relative w-full h-150 rounded-[65px] overflow-hidden mb-8">
          <Image src="/hero-image.jpg" alt="Hero" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-brand via-brand/20 to-transparent opacity-90 pointer-events-none" />
        </div>
        <p className="font-orbit text-text text-[22px] md:text-[24px] text-center leading-8.75 max-w-225 mb-8">
          Keep track of your favorite songs, albums and artists and rate them.<br />
          Check out your friends&apos; music taste.
        </p>
        <Link href="/register" className="flex items-center justify-center w-73.75 h-16.75 bg-mark hover:bg-mark/80 text-white font-orbitron font-bold text-[20px] rounded-[15px] transition-all mb-4">
          GET STARTED
        </Link>
        <p className="font-orbit text-text text-[16px]">
          Join the music lovers community.
        </p>
      </section>

      {/* --- SEKCJA 2: NEW RELEASES --- */}
      <section className="flex flex-col w-full max-w-266.25">
        <div className="w-full mb-6">
          <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">NEW RELEASES</h2>
          <div className="w-full h-px bg-text"></div>
        </div>
        <div className="flex justify-between w-full mb-5.5">
          {newReleasesAlbums.map((album) => (
            <div key={album.id} className="flex flex-col w-37.5">
              <div className="relative w-37.5 h-37.5 border border-effect mb-2">
                <Image src={album.coverUrl} alt={album.title} fill className="object-cover" />
              </div>
              <h3 className="font-orbit text-text text-[16px] text-center leading-tight">{album.title}</h3>
            </div>
          ))}
        </div>
        <p className="font-orbit text-text text-[16px] text-center">
          Check other new releases <Link href="/new-releases" className="underline hover:text-effect transition-colors">here</Link>.
        </p>
      </section>

      {/* --- SEKCJA 3: REVIEWS --- */}
      <section className="flex flex-col w-full max-w-266.25">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-6">
          
          {/* ================================== */}
          {/* KOLUMNA LEWA: LATEST SONG REVIEWS */}
          {/* ================================== */}
          <div className="flex flex-col w-full">
            <div className="w-full mb-4">
              <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">
                LATEST SONG REVIEWS
              </h2>
              <div className="w-full h-px bg-text"></div>
            </div>

            <div className="flex flex-col gap-4">
              {songReviews.map((review) => (
                // ZMIANA: Usunięto rounded-sm, dodano border border-effect
                <div key={review.id} className="w-full h-30 bg-text text-brand relative border border-effect">
                  
                  <div className="absolute top-2 left-2 w-15 h-15 border border-brand/20">
                    <Image src={review.coverUrl} alt={review.title} fill className="object-cover" />
                  </div>
                  
                  <h3 className="absolute top-2 left-19 font-orbitron font-bold text-[16px] underline decoration-brand underline-offset-2">
                    {review.title}
                  </h3>
                  <p className="absolute top-7 left-19 font-orbit text-[14px]">
                    from {review.album}
                  </p>
                  
                  <p className="absolute top-2 right-3 font-orbit text-[12px]">
                    by {review.artist}
                  </p>
                  
                  <p className="absolute top-16 left-0 w-full text-center font-orbitron text-[18px]">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    {/* Powiększono lekko awatar (w-6 h-6) żeby był lepiej widoczny */}
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-brand">
                       <Image src={review.avatarUrl} alt={review.user} fill className="object-cover" />
                    </div>
                    <span className="font-orbitron font-semibold text-[12px]">{review.user}</span>
                  </div>

                  <div className="absolute bottom-2 right-3">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================================== */}
          {/* KOLUMNA PRAWA: LATEST ALBUM REVIEWS*/}
          {/* ================================== */}
          <div className="flex flex-col w-full">
            <div className="w-full mb-4">
              <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">
                LATEST ALBUM REVIEWS
              </h2>
              <div className="w-full h-px bg-text"></div>
            </div>

            <div className="flex flex-col gap-4">
              {albumReviews.map((review) => (
                // ZMIANA: Usunięto rounded-sm, dodano border border-effect
                <div key={review.id} className="w-full h-30 bg-text text-brand relative border border-effect">
                  
                  <div className="absolute top-2 left-2 w-15 h-15 border border-brand/20">
                    <Image src={review.coverUrl} alt={review.title} fill className="object-cover" />
                  </div>
                  
                  <h3 className="absolute top-2 left-19 font-orbitron font-bold text-[16px] underline decoration-brand underline-offset-2">
                    {review.title}
                  </h3>
                  <p className="absolute top-7 left-19 font-orbit text-[14px]">
                    by {review.artist}
                  </p>
                  
                  <p className="absolute top-16 left-0 w-full text-center font-orbitron text-[18px]">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-brand">
                       <Image src={review.avatarUrl} alt={review.user} fill className="object-cover" />
                    </div>
                    <span className="font-orbitron font-semibold text-[12px]">{review.user}</span>
                  </div>

                  <div className="absolute bottom-2 right-3">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- TEKST NA SAMYM DOLE SEKCJI --- */}
        <div className="w-full text-center mt-2">
          <p className="font-orbit text-[16px] text-text">
            Start adding your own{" "}
            <Link href="/songs" className="underline underline-offset-4 hover:text-effect transition-colors">songs</Link>
            {" "}or{" "}
            <Link href="/albums" className="underline underline-offset-4 hover:text-effect transition-colors">albums&apos;</Link>
            {" "}reviews.
          </p>
        </div>

      </section>

    </div>
  );
}