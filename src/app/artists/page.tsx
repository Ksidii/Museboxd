import Image from "next/image";
import Link from "next/link";

const mockArtists = [
  { id: 1, name: "Bring Me The Horizon", genre: "Metalcore / Alternative Rock", coverUrl: "/hero-image.jpg" },
  { id: 2, name: "Arctic Monkeys", genre: "Indie Rock", coverUrl: "/hero-image.jpg" },
  { id: 3, name: "Radiohead", genre: "Alternative Rock", coverUrl: "/hero-image.jpg" },
  { id: 4, name: "Frank Ocean", genre: "R&B / Pop", coverUrl: "/hero-image.jpg" },
  { id: 5, name: "System of a Down", genre: "Alternative Metal", coverUrl: "/hero-image.jpg" },
  { id: 6, name: "Foo Fighters", genre: "Hard Rock", coverUrl: "/hero-image.jpg" },
  { id: 7, name: "Tame Impala", genre: "Psychedelic Pop", coverUrl: "/hero-image.jpg" },
  { id: 8, name: "Muse", genre: "Alternative Rock", coverUrl: "/hero-image.jpg" },
  { id: 9, name: "Deftones", genre: "Alternative Metal", coverUrl: "/hero-image.jpg" },
  { id: 10, name: "The Neighbourhood", genre: "Alternative Pop", coverUrl: "/hero-image.jpg" },
];

export default function ArtistsPage() {
  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2">
              Artists Database
            </h1>
            <p className="font-orbit text-[14px] text-text/70">
              Explore your favorite bands and artists.
            </p>
          </div>
          
          <div className="w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search for an artist..." 
              className="w-full h-10 bg-transparent border border-effect/50 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
            />
          </div>
        </div>

        <div className="w-full h-px bg-effect/30 mb-6"></div>

        <div className="flex flex-col gap-3">
          {mockArtists.map((artist, index) => (
            <Link href={`/artists/${artist.id}`} key={artist.id} className="group flex items-center bg-[#E5F4FA]/5 hover:bg-[#E5F4FA]/10 border border-effect/20 hover:border-effect/60 transition-colors p-3 gap-4">
              
              <div className="w-8 text-center font-orbitron text-text/50 text-[14px]">
                {index + 1}
              </div>

              {/* Zdjęcia artystów robimy okrągłe dla odróżnienia od albumów */}
              <div className="relative w-12 h-12 border border-brand/30 rounded-full overflow-hidden shrink-0">
                <Image src={artist.coverUrl} alt={artist.name} fill className="object-cover" />
              </div>

              <div className="flex flex-col grow min-w-0">
                <h3 className="font-orbitron font-bold text-[18px] text-text truncate group-hover:text-effect transition-colors">
                  {artist.name}
                </h3>
              </div>

              <div className="hidden md:flex flex-col w-64 text-right shrink-0">
                <p className="font-orbit text-[12px] text-text/60 truncate">Genre: <span className="text-text/90">{artist.genre}</span></p>
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
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black font-orbitron">8</button>
          <button className="w-10 h-10 flex items-center justify-center border border-effect/50 text-text hover:border-effect hover:text-effect transition-colors bg-black">&gt;</button>
        </div>

      </div>
    </div>
  );
}