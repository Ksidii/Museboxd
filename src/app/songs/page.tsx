import Image from "next/image";
import Link from "next/link";

// Przykładowe dane (Mock data)
const mockSongs = [
  { id: 1, title: "Can You Feel My Heart", artist: "Bring Me The Horizon", album: "Sempiternal", year: "2013", duration: "3:47", coverUrl: "/hero-image.jpg" },
  { id: 2, title: "Sleepwalking", artist: "Bring Me The Horizon", album: "Sempiternal", year: "2013", duration: "3:50", coverUrl: "/hero-image.jpg" },
  { id: 3, title: "MANTRA", artist: "Bring Me The Horizon", album: "amo", year: "2019", duration: "3:53", coverUrl: "/hero-image.jpg" },
  { id: 4, title: "Do I Wanna Know?", artist: "Arctic Monkeys", album: "AM", year: "2013", duration: "4:32", coverUrl: "/hero-image.jpg" },
  { id: 5, title: "Nights", artist: "Frank Ocean", album: "Blonde", year: "2016", duration: "5:07", coverUrl: "/hero-image.jpg" },
  { id: 6, title: "Chop Suey!", artist: "System of a Down", album: "Toxicity", year: "2001", duration: "3:30", coverUrl: "/hero-image.jpg" },
  { id: 7, title: "Karma Police", artist: "Radiohead", album: "OK Computer", year: "1997", duration: "4:21", coverUrl: "/hero-image.jpg" },
  { id: 8, title: "Everlong", artist: "Foo Fighters", album: "The Colour and the Shape", year: "1997", duration: "4:10", coverUrl: "/hero-image.jpg" },
  { id: 9, title: "Starlight", artist: "Muse", album: "Black Holes and Revelations", year: "2006", duration: "3:59", coverUrl: "/hero-image.jpg" },
  { id: 10, title: "The Less I Know The Better", artist: "Tame Impala", album: "Currents", year: "2015", duration: "3:36", coverUrl: "/hero-image.jpg" },
];

export default function SongsPage() {
  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      
      <div className="w-full max-w-266.25 flex flex-col">
        
        {/* Nagłówek i wyszukiwarka */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2">
              Songs Database
            </h1>
            <p className="font-orbit text-[14px] text-text/70">
              Browse and rate thousands of tracks.
            </p>
          </div>
          
          <div className="w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search for a song..." 
              className="w-full h-10 bg-transparent border border-effect/50 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
            />
          </div>
        </div>

        <div className="w-full h-px bg-effect/30 mb-6"></div>

        {/* Tabela / Lista piosenek */}
        <div className="flex flex-col gap-3">
          {mockSongs.map((song, index) => (
            <Link href={`/songs/${song.id}`} key={song.id} className="group flex items-center bg-[#E5F4FA]/5 hover:bg-[#E5F4FA]/10 border border-effect/20 hover:border-effect/60 transition-colors p-3 gap-4">
              
              {/* Numer (Indeks) */}
              <div className="w-8 text-center font-orbitron text-text/50 text-[14px]">
                {index + 1}
              </div>

              {/* Okładka */}
              <div className="relative w-12 h-12 border border-brand/30 shrink-0">
                <Image src={song.coverUrl} alt={song.title} fill className="object-cover" />
              </div>

              {/* Informacje o utworze */}
              <div className="flex flex-col grow min-w-0">
                <h3 className="font-orbitron font-bold text-[16px] text-text truncate group-hover:text-effect transition-colors">
                  {song.title}
                </h3>
                <p className="font-orbit text-[12px] text-text/80 truncate">
                  by {song.artist}
                </p>
              </div>

              {/* Album i Rok (Ukryte na bardzo małych ekranach) */}
              <div className="hidden md:flex flex-col w-48 shrink-0">
                <p className="font-orbit text-[12px] text-text/60 truncate">Album: <span className="text-text/90">{song.album}</span></p>
                <p className="font-orbit text-[12px] text-text/60">Year: <span className="text-text/90">{song.year}</span></p>
              </div>

              {/* Czas trwania */}
              <div className="w-12 text-right font-orbit text-[14px] text-text/70 shrink-0">
                {song.duration}
              </div>

            </Link>
          ))}
        </div>

        {/* === PAGINACJA (Nawigacja stron) === */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {/* Przycisk Poprzednia */}
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text/50 cursor-not-allowed bg-black">
            &lt;
          </button>
          
          {/* Numery stron */}
          <button className="w-10 h-10 flex items-center justify-center border border-effect bg-effect text-black font-orbitron font-bold">
            1
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black font-orbitron">
            2
          </button>
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black font-orbitron">
            3
          </button>
          
          <span className="text-text mx-1">...</span>
          
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black font-orbitron">
            24
          </button>

          {/* Przycisk Następna */}
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black">
            &gt;
          </button>
        </div>

      </div>
    </div>
  );
}