import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    // py-[23px] to Twój padding pionowy (23px góra i dół)
    // Zmieniłem px-6 na px-[75px], żeby marginesy boczne pasowały do Twojej 12-kolumnowej siatki z Figmy
    <header className="bg-black text-text font-orbitron border-b border-effect/30 py-5.75 px-4 md:px-18.75">
      
      {/* max-w-[1440px] blokuje maksymalną szerokość na Twoich wymiarach z Figmy */}
      {/* gap-[10px] to Twój pionowy odstęp między rzędem z logo a rzędem z menu */}
      <div className="max-w-360 mx-auto flex flex-col gap-2.5">
        
        {/* === GÓRNY RZĄD === */}
        <div className="flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center">
              <Image 
                src="/museboxxd-logo.png"
                alt="Museboxd Logo"
                width={90} // Upewnij się, że ten rozmiar pasuje do Figmy
                height={79}
                priority
                className="object-contain"
              />
            </div>

            {/* Museboxd: 32px, Bold, 2.5% letter-spacing */}
            <span className="text-[32px] font-bold tracking-wide group-hover:text-effect transition-colors">
              Museboxd
            </span>
          </Link>

          {/* SIGN IN: 20px, Bold, 2.5% letter-spacing */}
          <Link 
            href="/login" 
            className="text-[20px] font-bold tracking-wide hover:text-effect transition-colors uppercase"
          >
            SIGN IN / LOG IN
          </Link>
        </div>

        {/* === DOLNY RZĄD: Linki nawigacyjne === */}
        {/* Odstęp poziomy gap-[10px]. Zmień na np. gap-[40px], jeśli linki będą zbyt blisko siebie */}
        {/* Menu: 20px, Regular (font-normal), 2.5% letter-spacing */}
        <nav className="flex justify-center gap-37.5 text-[20px] font-normal tracking-wide uppercase">
          <Link href="/news" className="hover:text-effect transition-colors">NEWS</Link>
          <Link href="/songs" className="hover:text-effect transition-colors">SONGS</Link>
          <Link href="/albums" className="hover:text-effect transition-colors">ALBUMS</Link>
          <Link href="/artists" className="hover:text-effect transition-colors">ARTISTS</Link>
          <Link href="/charts" className="hover:text-effect transition-colors">CHARTS</Link>
        </nav>

      </div>
    </header>
  );
}