import Image from "next/image";
import Link from "next/link";
import RateAction from "@/components/RateAction";

interface DeezerAlbumTrack {
  id: number;
  title: string;
  duration: number;
}

interface DeezerAlbum {
  id: number;
  title: string;
  cover_xl: string;
  cover_medium: string;
  release_date: string;
  nb_tracks: number;
  duration: number;
  artist: {
    id: number;
    name: string;
  };
  tracks?: {
    data: DeezerAlbumTrack[];
  };
  error?: unknown;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

async function getAlbum(id: string): Promise<DeezerAlbum | null> {
  try {
    const res = await fetch(`https://api.deezer.com/album/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch album");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function AlbumDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const album = await getAlbum(resolvedParams.id);

  if (!album || album.error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-orbit text-text">
        Album not found.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col gap-8">
        
        {/* Przycisk powrotu */}
        <Link href="/albums" className="font-orbit text-text/60 hover:text-effect transition-colors w-fit">
          &lt; Back to Albums
        </Link>

        {/* === KARTA ALBUMU === */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-effect/5 border border-effect/20 p-6 md:p-10">
          
          {/* Duża okładka */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 border border-brand/30 shrink-0 shadow-lg shadow-brand/10">
            <Image 
              src={album.cover_xl || album.cover_medium || "/hero-image.jpg"} 
              alt={album.title} 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          {/* Informacje o albumie */}
          <div className="flex flex-col grow w-full">
            <h1 className="font-orbitron font-bold text-[36px] md:text-[48px] text-text mb-2 leading-tight">
              {album.title}
            </h1>
            <h2 className="font-orbitron text-[24px] text-brand mb-8">
              {album.artist.name}
            </h2>
            
            <div className="flex flex-col gap-3 font-orbit text-[16px] text-text/80 mb-10">
              <p>Release Date: <span className="text-text font-bold">{album.release_date || "Unknown"}</span></p>
              <p>Tracks: <span className="text-text font-bold">{album.nb_tracks}</span></p>
              <p>Total Duration: <span className="text-text font-bold">{formatDuration(album.duration)}</span></p>
            </div>

            {/* Przycisk oceniania */}
            <div className="flex items-center gap-6 mt-auto w-full border-t border-effect/20 pt-6">
              <RateAction 
                item={{
                  id: album.id,
                  type: "album",
                  title: album.title,
                  artist: album.artist.name,
                  cover: album.cover_medium
                }} 
              />
            </div>
          </div>
        </div>

        {/* === TRACKLISTA === */}
        {album.tracks?.data && album.tracks.data.length > 0 && (
          <div className="flex flex-col w-full mt-4">
            <h3 className="font-orbitron font-bold text-[20px] text-text uppercase mb-2">
              Tracklist
            </h3>
            <div className="w-full h-px bg-effect/30 mb-4"></div>

            <div className="flex flex-col gap-2">
              {album.tracks.data.map((track, index) => (
                <Link 
                  key={track.id} 
                  href={`/songs/${track.id}`}
                  className="flex justify-between items-center p-4 bg-effect/5 hover:bg-effect/15 border border-effect/10 hover:border-effect/40 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-orbitron text-[14px] text-text/50 w-6">
                      {index + 1}.
                    </span>
                    <span className="font-orbit text-[16px] text-text group-hover:text-effect transition-colors">
                      {track.title}
                    </span>
                  </div>
                  <span className="font-orbit text-[14px] text-text/60">
                    {formatDuration(track.duration)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}