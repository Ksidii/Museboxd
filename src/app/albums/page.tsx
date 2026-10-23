import Image from "next/image";
import Link from "next/link";

// Definicja kształtu danych albumu z API Deezera
interface DeezerAlbum {
  id: number;
  title: string;
  record_type: string;
  nb_tracks?: number; // Liczba utworów (opcjonalna, bo czasem API jej nie zwraca)
  artist: {
    name: string;
  };
  cover_medium: string;
}

// Funkcja pobierająca dane z Deezera
async function getAlbums(query: string, page: number) {
  const limit = 10;
  const index = (page - 1) * limit;

  try {
    const endpoint = query 
      ? `https://api.deezer.com/search/album?q=${encodeURIComponent(query)}&limit=${limit}&index=${index}`
      : `https://api.deezer.com/chart/0/albums?limit=${limit}&index=${index}`;
      
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch data");
    
    const data = await res.json();
    
    return {
      albums: data.data || [],
      // Dla wyszukiwania bierzemy prawdziwy total, dla domyślnych chartów wymuszamy 50
      total: query ? (data.total || 0) : 50 
    };
  } catch (error) {
    console.error("Błąd pobierania danych z Deezera:", error);
    return { albums: [], total: 0 };
  }
}

export default async function AlbumsPage({
  searchParams,
}: {
  // Tak jak w piosenkach - typujemy jako Promise dla najnowszego Next.js
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // Rozpakowujemy parametry z URL
  const params = await searchParams;
  const query = params.q || "";
  const currentPage = parseInt(params.page || "1", 10);
  
  // Pobieramy dane
  const { albums, total } = await getAlbums(query, currentPage);
  
  // Obliczanie całkowitej liczby stron
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

  // Funkcja budująca linki z zachowaniem wyszukiwanej frazy
  const createPageUrl = (pageNumber: number) => {
    const urlParams = new URLSearchParams();
    if (query) urlParams.set("q", query);
    if (pageNumber > 1) urlParams.set("page", pageNumber.toString());
    return `/albums?${urlParams.toString()}`;
  };

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col">
        
        {/* === NAGŁÓWEK I WYSZUKIWARKA === */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2">
              Albums Database
            </h1>
            <p className="font-orbit text-[14px] text-text/70">
              Discover and review complete albums.
            </p>
          </div>
          
          <form action="/albums" method="GET" className="w-full md:w-72">
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="Search for an album..." 
              className="w-full h-10 bg-transparent border border-effect/50 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
            />
          </form>
        </div>

        <div className="w-full h-px bg-effect/30 mb-6"></div>

        {/* === LISTA ALBUMÓW === */}
        <div className="flex flex-col gap-3">
          {albums.length > 0 ? (
            albums.map((album: DeezerAlbum, index: number) => (
              <Link href={`/albums/${album.id}`} key={album.id} className="group flex items-center bg-[#E5F4FA]/5 hover:bg-[#E5F4FA]/10 border border-effect/20 hover:border-effect/60 transition-colors p-3 gap-4">
                
                <div className="w-8 text-center font-orbitron text-text/50 text-[14px]">
                  {(currentPage - 1) * 10 + index + 1}
                </div>

                <div className="relative w-12 h-12 border border-brand/30 shrink-0">
                  <Image 
                    src={album.cover_medium || "/hero-image.jpg"} 
                    alt={album.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>

                <div className="flex flex-col grow min-w-0">
                  {/* Pamiętałam o zamianie koloru z text-brand na text-text, tak jak chciałaś! */}
                  <h3 className="font-orbitron font-bold text-[16px] text-text truncate group-hover:text-effect transition-colors">
                    {album.title}
                  </h3>
                  <p className="font-orbit text-[12px] text-text/80 truncate">
                    by {album.artist.name}
                  </p>
                </div>

                <div className="hidden md:flex flex-col w-48 shrink-0 justify-center">
                  <p className="font-orbit text-[12px] text-text/60 truncate capitalize">
                    Type: <span className="text-text/90">{album.record_type || "Album"}</span>
                  </p>
                </div>

                <div className="w-20 text-right font-orbit text-[12px] text-text/70 shrink-0">
                  {album.nb_tracks ? `${album.nb_tracks} tracks` : "-"}
                </div>

              </Link>
            ))
          ) : (
            <div className="w-full py-10 text-center font-orbit text-text/60">
              No albums found. Try a different search term.
            </div>
          )}
        </div>

        {/* === PAGINACJA === */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            
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