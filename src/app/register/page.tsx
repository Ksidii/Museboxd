"use client";

import Link from "next/link";
import { useState } from "react";
// Importujemy nasz "most" do bazy danych
import { supabase } from "@/lib/supabase"; 

export default function RegisterPage() {
  // Stany zapamiętujące wpisywane dane
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Stany do obsługi ładowania, błędów i sukcesu
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Funkcja wywoływana po kliknięciu przycisku "Sign Up"
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Zapobiega odświeżeniu strony
    setLoading(true);
    setError(null);

    // Wywołanie rejestracji w Supabase
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username, // Zapisujemy nazwę użytkownika w dodatkowych danych
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-17 pb-17 px-4 min-h-[70vh]">
      
      <div className="w-full max-w-125 flex flex-col items-center">
        
        {/* === NAGŁÓWEK === */}
        <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2 text-center tracking-wide">
          Create Account
        </h1>
        <p className="font-orbit text-[16px] text-text/80 mb-8 text-center">
          Join the Museboxd community to rate and track music.
        </p>

        {/* Jeśli rejestracja się udała, pokazujemy komunikat zamiast formularza */}
        {success ? (
          <div className="w-full bg-effect/20 border-2 border-effect text-text p-6 rounded-[15px] text-center">
            <h2 className="font-orbitron text-[20px] mb-2 text-brand">Success!</h2>
            <p className="font-orbit">
              Your account has been created. Please check your email inbox to verify your account.
            </p>
          </div>
        ) : (
          /* === FORMULARZ === */
          <form onSubmit={handleSignUp} className="w-full flex flex-col gap-5">
            
            {/* Pole: Username */}
            <div className="flex flex-col gap-2">
              <label className="font-orbit text-[14px] text-text uppercase tracking-wide">
                Username
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12.5 bg-transparent border-2 border-effect/40 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
                placeholder="Choose a display name"
              />
            </div>

            {/* Pole: Email */}
            <div className="flex flex-col gap-2">
              <label className="font-orbit text-[14px] text-text uppercase tracking-wide">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12.5 bg-transparent border-2 border-effect/40 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
                placeholder="Enter your email"
              />
            </div>

            {/* Pole: Password */}
            <div className="flex flex-col gap-2">
              <label className="font-orbit text-[14px] text-text uppercase tracking-wide">
                Password
              </label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12.5 bg-transparent border-2 border-effect/40 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
                placeholder="Create a strong password"
              />
            </div>

            {/* Wyświetlanie błędów */}
            {error && (
              <p className="text-red-500 font-orbit text-[14px] text-center">
                {error}
              </p>
            )}

            {/* Przycisk */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-15 bg-mark hover:bg-mark/80 disabled:bg-mark/50 disabled:cursor-not-allowed text-white font-orbitron font-bold text-[20px] rounded-[15px] transition-all mt-4 uppercase flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>

          </form>
        )}

        {/* === ODNOŚNIK DO LOGOWANIA === */}
        {!success && (
          <div className="w-full text-center mt-6">
            <p className="font-orbit text-[16px] text-text">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4 hover:text-effect transition-colors">
                Log in
              </Link>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}