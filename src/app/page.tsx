import Image from "next/image";
import Link from "next/link";

// ==========================================
// 1. DEEZER API
// ==========================================
async function getDeezerNewReleases() {
  try {
    // API Deezera jest otwarte, pobieramy aktualne top albumy
    // Dodajemy revalidate, by Next.js odświeżał listę co godzinę (3600 sekund)
    const response = await fetch('https://api.deezer.com/chart/0/albums', {
      next: { revalidate: 3600 } 
    });

    if (!response.ok) {
       console.error("Błąd pobierania danych z Deezera");
       return [];
    }

    const data = await response.json();

    // Formatujemy dane i bierzemy tylko 6 pierwszych wyników
    // Od razu definiujemy typy, żeby TypeScript (ESLint) nie krzyczał o błąd 'any'
    return data.data.slice(0, 6).map((album: { id: number; title: string; cover_xl: string; cover_medium: string }) => ({
      id: album.id.toString(),
      title: album.title,
      coverUrl: album.cover_xl || album.cover_medium, 
    }));
  } catch (error) {
    console.error("Błąd połączenia z Deezerem:", error);
    return [];
  }
}

// ==========================================
// 2. DANE TESTOWE (MOCK DATA - reszta strony)
// ==========================================
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

const recentNews = [
  { id: 1, title: "Lorem Ipsum", excerpt: "Lorem Ipsum has been the industry's standard dummy text", coverUrl: "/hero-image.jpg" },
  { id: 2, title: "Lorem Ipsum", excerpt: "Lorem Ipsum has been the industry's standard dummy text", coverUrl: "/hero-image.jpg" },
  { id: 3, title: "Lorem Ipsum", excerpt: "Lorem Ipsum has been the industry's standard dummy text", coverUrl: "/hero-image.jpg" },
];

const featureTexts = [
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make.",
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make.",
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make.",
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make."
];

// ==========================================
// 3. KOMPONENT GWIAZDEK
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
// 4. GŁÓWNA STRONA (Async)
// ==========================================
export default async function Home() {
  // Wywołujemy funkcję z Deezera
  const newReleasesAlbums = await getDeezerNewReleases();

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

      {/* --- SEKCJA 2: WITH MUSEBOXD YOU CAN --- */}
      <section className="flex flex-col w-full max-w-266.25">
        <div className="w-full mb-6">
          <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">
            WITH MUSEBOXD YOU CAN
          </h2>
          <div className="w-full h-px bg-text"></div>
        </div>

        <div className="flex flex-col items-center gap-4.5 w-full mb-6">
          {featureTexts.map((text, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center w-full max-w-212.5 min-h-22.5 bg-text border-2 border-effect rounded-[15px] px-6 py-4 text-center"
            >
              <p className="font-orbitron font-bold text-[20px] text-brand leading-tight">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full text-center">
          <p className="font-orbit text-[16px] text-text">
            Find out what else does Museboxd have to offer... Click{" "}
            <Link href="/features" className="underline underline-offset-4 hover:text-effect transition-colors">here</Link>.
          </p>
        </div>
      </section>

      {/* --- SEKCJA 3: NEW RELEASES (Dane z Deezera) --- */}
      <section className="flex flex-col w-full max-w-266.25">
        <div className="w-full mb-6">
          <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">NEW RELEASES</h2>
          <div className="w-full h-px bg-text"></div>
        </div>
        
        {newReleasesAlbums.length === 0 ? (
          <p className="font-orbit text-text text-center my-10">Brak nowych wydań. Sprawdź połączenie z API.</p>
        ) : (
          <div className="flex justify-between w-full mb-5.5 gap-4 overflow-x-auto pb-4">
            {/* Tutaj też mamy piękny, czysty typ zamiast 'any' */}
            {newReleasesAlbums.map((album: { id: string; title: string; coverUrl: string }) => (
              <div key={album.id} className="flex flex-col w-37.5 shrink-0">
                <div className="relative w-37.5 h-37.5 border border-effect mb-2">
                  {/* Używamy unoptimized, ponieważ obrazki z zewnętrznych API czasem sprawiają problemy przy formatowaniu Next.js w trybie deweloperskim */}
                  <Image 
                    src={album.coverUrl} 
                    alt={album.title} 
                    fill 
                    unoptimized
                    sizes="(max-width: 150px) 100vw, 150px"
                    className="object-cover" 
                  />
                </div>
                <h3 className="font-orbit text-text text-[16px] text-center leading-tight line-clamp-2">
                  {album.title}
                </h3>
              </div>
            ))}
          </div>
        )}
        
        <p className="font-orbit text-text text-[16px] text-center mt-4">
          Check other new releases <Link href="/new-releases" className="underline hover:text-effect transition-colors">here</Link>.
        </p>
      </section>

      {/* --- SEKCJA 4: REVIEWS --- */}
      <section className="flex flex-col w-full max-w-266.25">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-6">
          
          <div className="flex flex-col w-full">
            <div className="w-full mb-4">
              <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">
                LATEST SONG REVIEWS
              </h2>
              <div className="w-full h-px bg-text"></div>
            </div>

            <div className="flex flex-col gap-4">
              {songReviews.map((review) => (
                <div key={review.id} className="w-full h-30 bg-text text-brand relative border border-effect">
                  
                  <div className="absolute top-2 left-2 w-15 h-15 border border-brand/20">
                    <Image src={review.coverUrl} alt={review.title} fill className="object-cover" />
                  </div>
                  
                  <h3 className="absolute top-2 left-19 font-orbitron font-bold text-[16px] underline decoration-brand underline-offset-2 truncate pr-2">
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

          <div className="flex flex-col w-full">
            <div className="w-full mb-4">
              <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">
                LATEST ALBUM REVIEWS
              </h2>
              <div className="w-full h-px bg-text"></div>
            </div>

            <div className="flex flex-col gap-4">
              {albumReviews.map((review) => (
                <div key={review.id} className="w-full h-30 bg-text text-brand relative border border-effect">
                  
                  <div className="absolute top-2 left-2 w-15 h-15 border border-brand/20">
                    <Image src={review.coverUrl} alt={review.title} fill className="object-cover" />
                  </div>
                  
                  <h3 className="absolute top-2 left-19 font-orbitron font-bold text-[16px] underline decoration-brand underline-offset-2 truncate pr-2">
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

      {/* --- SEKCJA 5: RECENT NEWS --- */}
      <section className="flex flex-col w-full max-w-266.25">
        
        <div className="w-full mb-6">
          <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-1">
            RECENT NEWS
          </h2>
          <div className="w-full h-px bg-text"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-6">
          {recentNews.map((news) => (
            <div key={news.id} className="relative w-full h-77.5 overflow-hidden">
              
              <Image 
                src={news.coverUrl} 
                alt={news.title} 
                fill 
                className="object-cover" 
              />
              
              <div className="absolute bottom-0 w-full h-27.5 bg-text/90 p-4 flex flex-col justify-start">
                <h3 className="font-orbitron font-bold text-[16px] text-brand mb-1">
                  {news.title}
                </h3>
                <p className="font-orbit text-[14px] text-brand leading-relaxed">
                  {news.excerpt}
                </p>
              </div>

            </div>
          ))}
        </div>

        <div className="w-full text-center">
          <p className="font-orbit text-[16px] text-text">
            Check out all of the{" "}
            <Link href="/news" className="underline underline-offset-4 hover:text-effect transition-colors">news</Link>
            {" "}in the music industry.
          </p>
        </div>

      </section>

    </div>
  );
}