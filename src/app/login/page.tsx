"use client";

import Link from "next/link";
import { useState } from "react";
// Importujemy router z nawigacji Next.js do automatycznego przenoszenia stron
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Zamiast signUp, używamy funkcji signInWithPassword
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Jeśli logowanie się powiodło, odświeżamy sesję i przenosimy na stronę główną
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-17 pb-17 px-4 min-h-[70vh]">
      
      <div className="w-full max-w-125 flex flex-col items-center">
        
        {/* === NAGŁÓWEK === */}
        <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2 text-center tracking-wide">
          Welcome Back
        </h1>
        <p className="font-orbit text-[16px] text-text/80 mb-8 text-center">
          Log in to your Museboxd account to rate and track music.
        </p>

        {/* === FORMULARZ LOGOWANIA === */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12.5 bg-transparent border-2 border-effect/40 rounded-sm px-4 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
              placeholder="Enter your password"
            />
          </div>

          {/* Wyświetlanie błędów (np. złe hasło) */}
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
            {loading ? "Processing..." : "Log In"}
          </button>

        </form>

        {/* === ODNOŚNIK DO REJESTRACJI === */}
        <div className="w-full text-center mt-6">
          <p className="font-orbit text-[16px] text-text">
            You do not have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-effect transition-colors">
              Sign up
            </Link>.
          </p>
        </div>

      </div>
    </div>
  );
}