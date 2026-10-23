import Image from "next/image";
import Link from "next/link";
import RateAction from "@/components/RateAction";

// Funkcja pomocnicza (ta sama co na liście utworów)
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Pobieramy detale utworu prosto z API Deezera po jego ID
async function getTrack(id: string) {
  try {
    const res = await fetch(`https://api.deezer.com/track/${id}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch track");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function SongDetailsPage({
  params,
}: {
  // Rozpakowujemy asynchroniczne parametry tak samo jak przy paginacji
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const track = await getTrack(resolvedParams.id);

  // Jeśli ktoś wpisze złe ID w linku
  if (!track || track.error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-orbit text-text">
        Song not found.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-screen">
      <div className="w-full max-w-266.25 flex flex-col gap-6">
        
        {/* Przycisk powrotu */}
        <Link href="/songs" className="font-orbit text-text/60 hover:text-effect transition-colors w-fit mb-4">
          &lt; Back to Database
        </Link>

        {/* === KARTA UTWORU === */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-effect/5 border border-effect/20 p-6 md:p-10">
          
          {/* Duża okładka */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 border border-brand/30 shrink-0 shadow-lg shadow-brand/10">
            <Image 
              src={track.album.cover_xl || track.album.cover_medium || "/hero-image.jpg"} 
              alt={track.title} 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          {/* Informacje */}
          <div className="flex flex-col grow w-full">
            <h1 className="font-orbitron font-bold text-[36px] md:text-[48px] text-text mb-2 leading-tight">
              {track.title}
            </h1>
            <h2 className="font-orbitron text-[24px] text-brand mb-8">
              {track.artist.name}
            </h2>
            
            <div className="flex flex-col gap-3 font-orbit text-[16px] text-text/80 mb-10">
              <p>Album: <span className="text-text font-bold">{track.album.title}</span></p>
              <p>Duration: <span className="text-text font-bold">{formatDuration(track.duration)}</span></p>
              <p>Release Date: <span className="text-text font-bold">{track.release_date || "Unknown"}</span></p>
            </div>

            {/* Dolny panel z akcjami */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-auto w-full border-t border-effect/20 pt-6">
              
              {/* Nasz przycisk z okienkiem recenzji */}
              <RateAction track={track} />
              
              {/* Natywny odtwarzacz audio (jeśli Deezer udostępnia demo) */}
              {track.preview && (
                <div className="w-full max-w-sm grow">
                  <audio controls className="w-full h-12">
                    <source src={track.preview} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}