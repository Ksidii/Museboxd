"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Sprawdzanie sesji przy załadowaniu
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchSession();

    // Nasłuchiwanie zmian logowania
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
  };

  const username = user?.user_metadata?.username || "User";
  const avatarUrl = "/avatar.jpg"; 

  return (
    <header className="bg-black text-text font-orbitron border-b border-effect/30 py-5.75 px-4 md:px-18.75 relative z-50">
      
      <div className="max-w-360 mx-auto flex flex-col gap-2.5">
        
        {/* === GÓRNY RZĄD === */}
        <div className="flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center">
              <Image 
                src="/museboxxd-logo.png"
                alt="Museboxd Logo"
                width={90} 
                height={79}
                priority
                className="object-contain"
              />
            </div>
            <span className="text-[32px] font-bold tracking-wide group-hover:text-effect transition-colors">
              Museboxd
            </span>
          </Link>

          {/* === PRAWA STRONA GÓRNEGO RZĘDU (Zalogowany / Niezalogowany) === */}
          <div className="flex items-center">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
                >
                  {/* Awatar */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-effect">
                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                  </div>
                  
                  {/* Nazwa profilu */}
                  <span className="text-[20px] font-bold tracking-wide uppercase">
                    {username}
                  </span>
                  
                  {/* Strzałka */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Rozwijane menu (Dropdown) dopasowane do Twoich kolorów */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-4 w-48 bg-black border border-effect/50 rounded-sm overflow-hidden flex flex-col shadow-lg z-50">
                    <Link 
                      href="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-4 py-3 font-orbit text-[16px] text-text hover:bg-effect/20 hover:text-effect transition-colors border-b border-effect/20"
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-4 py-3 font-orbit text-[16px] text-text hover:bg-effect/20 hover:text-effect transition-colors border-b border-effect/20"
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-3 font-orbit text-[16px] text-red-500 hover:bg-red-500/10 transition-colors text-left font-bold"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-[20px] font-bold tracking-wide hover:text-effect transition-colors uppercase"
              >
                SIGN IN / LOG IN
              </Link>
            )}
          </div>

        </div>

        {/* === DOLNY RZĄD: Linki nawigacyjne === */}
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