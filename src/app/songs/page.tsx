import Image from "next/image";
import Link from "next/link";

interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_medium: string;
  };
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Zmodyfikowana funkcja, która przyjmuje numer strony i zwraca również całkowitą liczbę wyników
async function getSongs(query: string, page: number) {
  const limit = 10;
  const index = (page - 1) * limit; // Obliczanie offsetu dla API

  try {
    const endpoint = query 
      ? `https://api.deezer.com/search/track?q=${encodeURIComponent(query)}&limit=${limit}&index=${index}`
      : `https://api.deezer.com/chart/0/tracks?limit=${limit}&index=${index}`;
      
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch data");
    
    const data = await res.json();
    
    return {
      tracks: data.data || [],
      // POPRAWKA: Dla wyszukiwania bierzemy prawdziwy total, dla domyślnych chartów wymuszamy 50
      total: query ? (data.total || 0) : 50 
    };
  } catch (error) {
    console.error("Błąd pobierania danych z Deezera:", error);
    return { tracks: [], total: 0 };
  }
}

export default async function SongsPage({
  searchParams,
}: {
  // Aktualizacja typowania na Promise
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // 1. Odczekujemy na załadowanie parametrów z adresu URL
  const params = await searchParams;
  
  const query = params.q || "";
  // 2. Odczytujemy prawdziwy numer strony (teraz poprawnie chwyci "2")
  const currentPage = parseInt(params.page || "1", 10);
  
  const { tracks: songs, total } = await getSongs(query, currentPage);
  
  const totalPages = Math.ceil(total / 10);

  // === LOGIKA WYŚWIETLANIA MAX 3 STRON ===
  let startPage = Math.max(1, currentPage - 1);
  const endPage = Math.min(totalPages, startPage + 2);
  
  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2);
  }
  
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // ... cała reszta pętli tworzącej linki (createPageUrl) i zwracany HTML (return) zostają bez zmian

  // Funkcja budująca linki z zachowaniem wyszukiwanej frazy
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (pageNumber > 1) params.set("page", pageNumber.toString());
    return `/songs?${params.toString()}`;
  };

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2">
              Songs Database
            </h1>
            <p className="font-orbit text-[14px] text-text/70">
              Browse and rate thousands of tracks.
            </p>
          </div>
          
          <form action="/songs" method="GET" className="w-full md:w-72">
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="Search for a song..." 
              className="w-full h-10 bg-transparent border border-effect/50 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
            />
          </form>
        </div>

        <div className="w-full h-px bg-effect/30 mb-6"></div>

        <div className="flex flex-col gap-3">
          {songs.length > 0 ? (
            songs.map((song: DeezerTrack, index: number) => (
              <Link href={`/songs/${song.id}`} key={song.id} className="group flex items-center bg-[#E5F4FA]/5 hover:bg-[#E5F4FA]/10 border border-effect/20 hover:border-effect/60 transition-colors p-3 gap-4">
                
                <div className="w-8 text-center font-orbitron text-text/50 text-[14px]">
                  {(currentPage - 1) * 10 + index + 1}
                </div>

                <div className="relative w-12 h-12 border border-brand/30 shrink-0">
                  <Image 
                    src={song.album.cover_medium || "/hero-image.jpg"} 
                    alt={song.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>

                <div className="flex flex-col grow min-w-0">
                  <h3 className="font-orbitron font-bold text-[16px] text-text truncate group-hover:text-effect transition-colors">
                    {song.title}
                  </h3>
                  <p className="font-orbit text-[12px] text-text/80 truncate">
                    by {song.artist.name}
                  </p>
                </div>

                <div className="hidden md:flex flex-col w-48 shrink-0 justify-center">
                  <p className="font-orbit text-[12px] text-text/60 truncate">Album: <span className="text-text/90">{song.album.title}</span></p>
                </div>

                <div className="w-12 text-right font-orbit text-[14px] text-text/70 shrink-0">
                  {formatDuration(song.duration)}
                </div>
              </Link>
            ))
          ) : (
            <div className="w-full py-10 text-center font-orbit text-text/60">
              No songs found. Try a different search term.
            </div>
          )}
        </div>

        {/* === PAGINACJA === */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            
            {/* Pierwsza strona (<<) */}
            <Link 
              href={createPageUrl(1)} 
              className={`w-10 h-10 flex items-center justify-center border font-orbitron font-bold transition-colors ${
                currentPage === 1 
                  ? "border-effect/20 text-text/30 cursor-not-allowed bg-black pointer-events-none" 
                  : "border-effect/50 text-text hover:border-effect hover:text-effect bg-black"
              }`}
            >
              &lt;&lt;
            </Link>

            {/* Poprzednia strona (<) */}
            <Link 
              href={createPageUrl(currentPage - 1)} 
              className={`w-10 h-10 flex items-center justify-center border font-orbitron font-bold transition-colors ${
                currentPage === 1 
                  ? "border-effect/20 text-text/30 cursor-not-allowed bg-black pointer-events-none" 
                  : "border-effect/50 text-text hover:border-effect hover:text-effect bg-black"
              }`}
            >
              &lt;
            </Link>
            
            {/* Numery stron (Max 3) */}
            {pages.map((p) => (
              <Link 
                key={p}
                href={createPageUrl(p)}
                className={`w-10 h-10 flex items-center justify-center border font-orbitron font-bold transition-colors ${
                  currentPage === p 
                    ? "border-effect bg-effect text-black" 
                    : "border-effect/50 text-text hover:border-effect hover:text-effect bg-black"
                }`}
              >
                {p}
              </Link>
            ))}

            {/* Następna strona (>) */}
            <Link 
              href={createPageUrl(currentPage + 1)} 
              className={`w-10 h-10 flex items-center justify-center border font-orbitron font-bold transition-colors ${
                currentPage >= totalPages 
                  ? "border-effect/20 text-text/30 cursor-not-allowed bg-black pointer-events-none" 
                  : "border-effect/50 text-text hover:border-effect hover:text-effect bg-black"
              }`}
            >
              &gt;
            </Link>

            {/* Ostatnia strona (>>) */}
            <Link 
              href={createPageUrl(totalPages)} 
              className={`w-10 h-10 flex items-center justify-center border font-orbitron font-bold transition-colors ${
                currentPage >= totalPages 
                  ? "border-effect/20 text-text/30 cursor-not-allowed bg-black pointer-events-none" 
                  : "border-effect/50 text-text hover:border-effect hover:text-effect bg-black"
              }`}
            >
              &gt;&gt;
            </Link>
            
          </div>
        )}

      </div>
    </div>
  );
}