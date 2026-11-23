import Image from "next/image";
import Link from "next/link";

interface DeezerArtist {
  id: number;
  name: string;
  picture_xl: string;
  picture_medium: string;
  nb_album: number;
  nb_fan: number;
  error?: unknown;
}

interface DeezerTopTrack {
  id: number;
  title: string;
  duration: number;
  album: {
    title: string;
    cover_small: string;
  };
}

interface DeezerArtistAlbum {
  id: number;
  title: string;
  cover_medium: string;
  release_date: string;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

async function getArtistData(id: string) {
  try {
    const [artistRes, topTracksRes, albumsRes] = await Promise.all([
      fetch(`https://api.deezer.com/artist/${id}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.deezer.com/artist/${id}/top?limit=5`, { next: { revalidate: 3600 } }),
      fetch(`https://api.deezer.com/artist/${id}/albums?limit=12`, { next: { revalidate: 3600 } }),
    ]);

    if (!artistRes.ok) return null;

    const artist: DeezerArtist = await artistRes.json();
    if (!artist || artist.error) return null;

    const topTracksData = topTracksRes.ok ? await topTracksRes.json() : { data: [] };
    const albumsData = albumsRes.ok ? await albumsRes.json() : { data: [] };

    return {
      artist,
      topTracks: (topTracksData.data || []) as DeezerTopTrack[],
      albums: (albumsData.data || []) as DeezerArtistAlbum[],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function ArtistDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const data = await getArtistData(resolvedParams.id);

  if (!data) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-orbit text-text">
        Artist not found.
      </div>
    );
  }

  const { artist, topTracks, albums } = data;

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col gap-10">
        
        {/* Przycisk powrotu */}
        <Link href="/artists" className="font-orbit text-text/60 hover:text-effect transition-colors w-fit">
          &lt; Back to Artists
        </Link>

        {/* === KARTA ARTYSTY === */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-effect/5 border border-effect/20 p-6 md:p-10">
          
          {/* Zdjęcie artysty */}
          <div className="relative w-56 h-56 md:w-64 md:h-64 border border-effect/40 shrink-0 shadow-lg shadow-mark/20">
            <Image 
              src={artist.picture_xl || artist.picture_medium || "/hero-image.jpg"} 
              alt={artist.name} 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          {/* Informacje */}
          <div className="flex flex-col grow w-full text-center md:text-left justify-center">
            <span className="font-orbit text-[12px] text-effect uppercase tracking-widest mb-2">
              Artist Profile
            </span>
            <h1 className="font-orbitron font-bold text-[36px] md:text-[48px] text-text mb-6 leading-tight">
              {artist.name}
            </h1>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-8 font-orbit text-[16px] text-text/80 border-t border-effect/20 pt-6">
              <div>
                <p className="text-[12px] text-text/50 uppercase">Fans on Deezer</p>
                <p className="font-orbitron font-bold text-[20px] text-text">
                  {artist.nb_fan.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-text/50 uppercase">Albums</p>
                <p className="font-orbitron font-bold text-[20px] text-text">
                  {artist.nb_album}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === TOP TRACKS === */}
        {topTracks.length > 0 && (
          <div className="flex flex-col w-full">
            <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-2">
              Popular Tracks
            </h2>
            <div className="w-full h-px bg-effect/30 mb-4"></div>

            <div className="flex flex-col gap-2">
              {topTracks.map((track, index) => (
                <Link 
                  key={track.id} 
                  href={`/songs/${track.id}`}
                  className="flex justify-between items-center p-3 bg-effect/5 hover:bg-effect/15 border border-effect/10 hover:border-effect/40 transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-orbitron text-[14px] text-text/50 w-5 shrink-0">
                      {index + 1}.
                    </span>
                    <div className="relative w-10 h-10 border border-effect/30 shrink-0">
                      <Image 
                        src={track.album.cover_small || "/hero-image.jpg"} 
                        alt={track.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-orbit text-[16px] text-text group-hover:text-effect transition-colors truncate">
                        {track.title}
                      </p>
                      <p className="font-orbit text-[12px] text-text/50 truncate">
                        {track.album.title}
                      </p>
                    </div>
                  </div>
                  <span className="font-orbit text-[14px] text-text/60 shrink-0 ml-4">
                    {formatDuration(track.duration)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* === DYSKOGRAFIA (ALBUMY) === */}
        {albums.length > 0 && (
          <div className="flex flex-col w-full">
            <h2 className="font-orbitron font-bold text-[20px] text-text uppercase mb-2">
              Discography
            </h2>
            <div className="w-full h-px bg-effect/30 mb-6"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {albums.map((album) => (
                <Link 
                  key={album.id} 
                  href={`/albums/${album.id}`}
                  className="flex flex-col bg-effect/5 border border-effect/20 hover:border-effect p-3 transition-all group"
                >
                  <div className="relative w-full aspect-square mb-3 border border-effect/20 overflow-hidden">
                    <Image 
                      src={album.cover_medium || "/hero-image.jpg"} 
                      alt={album.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <h3 className="font-orbitron font-bold text-[14px] text-text group-hover:text-effect transition-colors truncate">
                    {album.title}
                  </h3>
                  <p className="font-orbit text-[12px] text-text/60 mt-1">
                    {album.release_date ? album.release_date.slice(0, 4) : "Unknown"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}