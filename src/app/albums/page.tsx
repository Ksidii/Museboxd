import Image from "next/image";
import Link from "next/link";

const mockAlbums = [
  { id: 1, title: "Sempiternal", artist: "Bring Me The Horizon", year: "2013", tracks: 11, coverUrl: "/hero-image.jpg" },
  { id: 2, title: "AM", artist: "Arctic Monkeys", year: "2013", tracks: 12, coverUrl: "/hero-image.jpg" },
  { id: 3, title: "Blonde", artist: "Frank Ocean", year: "2016", tracks: 17, coverUrl: "/hero-image.jpg" },
  { id: 4, title: "Toxicity", artist: "System of a Down", year: "2001", tracks: 14, coverUrl: "/hero-image.jpg" },
  { id: 5, title: "OK Computer", artist: "Radiohead", year: "1997", tracks: 12, coverUrl: "/hero-image.jpg" },
  { id: 6, title: "amo", artist: "Bring Me The Horizon", year: "2019", tracks: 13, coverUrl: "/hero-image.jpg" },
  { id: 7, title: "The Colour and the Shape", artist: "Foo Fighters", year: "1997", tracks: 13, coverUrl: "/hero-image.jpg" },
  { id: 8, title: "Currents", artist: "Tame Impala", year: "2015", tracks: 13, coverUrl: "/hero-image.jpg" },
  { id: 9, title: "Black Holes and Revelations", artist: "Muse", year: "2006", tracks: 11, coverUrl: "/hero-image.jpg" },
  { id: 10, title: "In Rainbows", artist: "Radiohead", year: "2007", tracks: 10, coverUrl: "/hero-image.jpg" },
];

export default function AlbumsPage() {
  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2">
              Albums Database
            </h1>
            <p className="font-orbit text-[14px] text-text/70">
              Discover and review complete albums.
            </p>
          </div>
          
          <div className="w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search for an album..." 
              className="w-full h-10 bg-transparent border border-effect/50 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
            />
          </div>
        </div>

        <div className="w-full h-px bg-effect/30 mb-6"></div>

        <div className="flex flex-col gap-3">
          {mockAlbums.map((album, index) => (
            <Link href={`/albums/${album.id}`} key={album.id} className="group flex items-center bg-[#E5F4FA]/5 hover:bg-[#E5F4FA]/10 border border-effect/20 hover:border-effect/60 transition-colors p-3 gap-4">
              
              <div className="w-8 text-center font-orbitron text-text/50 text-[14px]">
                {index + 1}
              </div>

              <div className="relative w-12 h-12 border border-brand/30 shrink-0">
                <Image src={album.coverUrl} alt={album.title} fill className="object-cover" />
              </div>

              <div className="flex flex-col grow min-w-0">
                <h3 className="font-orbitron font-bold text-[16px] text-text truncate group-hover:text-effect transition-colors">
                  {album.title}
                </h3>
                <p className="font-orbit text-[12px] text-text/80 truncate">
                  by {album.artist}
                </p>
              </div>

              <div className="hidden md:flex flex-col w-48 shrink-0">
                <p className="font-orbit text-[12px] text-text/60 truncate">Year: <span className="text-text/90">{album.year}</span></p>
              </div>

              <div className="w-20 text-right font-orbit text-[12px] text-text/70 shrink-0">
                {album.tracks} tracks
              </div>

            </Link>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-12">
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text/50 cursor-not-allowed bg-black">&lt;</button>
          <button className="w-10 h-10 flex items-center justify-center border border-effect bg-effect text-black font-orbitron font-bold">1</button>
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black font-orbitron">2</button>
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black font-orbitron">3</button>
          <span className="text-text mx-1">...</span>
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black font-orbitron">15</button>
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black">&gt;</button>
        </div>

      </div>
    </div>
  );
}