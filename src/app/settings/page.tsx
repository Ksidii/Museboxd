"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  
  // Stany dla formularza hasła
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // === NOWE STANY: Widoczność haseł ===
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
      } else {
        setIsCheckingAuth(false);
      }
    };
    
    checkUser();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match. Please try again." });
      setLoading(false);
      return; 
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Password has been successfully updated!" });
      setNewPassword(""); 
      setConfirmPassword("");
      // Ukrywamy hasła z powrotem po udanej zmianie
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
    
    setLoading(false);
  };

  if (isCheckingAuth) {
    return <div className="min-h-[70vh] flex items-center justify-center font-orbitron text-text">Loading secure area...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 min-h-[70vh]">
      
      <div className="w-full max-w-266.25 flex flex-col items-center">
        
        <h1 className="font-orbitron font-bold text-[32px] text-text uppercase mb-2 text-center tracking-wide">
          Account Settings
        </h1>
        <p className="font-orbit text-[16px] text-text/80 mb-12 text-center">
          Manage your account details and security preferences.
        </p>

        <div className="w-full max-w-125 flex flex-col gap-10">
          
          {/* Sekcja zmiany hasła */}
          <div className="flex flex-col border border-effect/30 bg-[#E5F4FA]/5 p-6 md:p-8">
            <h2 className="font-orbitron font-bold text-[20px] text-brand uppercase mb-4 border-b border-effect/20 pb-2">
              Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-5 mt-2">
              
              {/* Pole: Nowe hasło */}
              <div className="flex flex-col gap-2">
                <label className="font-orbit text-[14px] text-text uppercase tracking-wide">
                  New password
                </label>
                <div className="relative w-full">
                  <input 
                    // Dynamiczna zmiana typu pola
                    type={showPassword ? "text" : "password"} 
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    // Dodaliśmy pr-12 (padding-right), żeby tekst nie wjeżdżał pod ikonę
                    className="w-full h-12.5 bg-transparent border-2 border-effect/40 rounded-sm pl-4 pr-12 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
                    placeholder="Enter a new strong password"
                  />
                  {/* Przycisk z ikoną oczka */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text/50 hover:text-effect transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      // Ikona otwartego oczka
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      // Ikona zamkniętego (przekreślonego) oczka
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Pole: Potwierdź hasło */}
              <div className="flex flex-col gap-2">
                <label className="font-orbit text-[14px] text-text uppercase tracking-wide">
                  Confirm new password
                </label>
                <div className="relative w-full">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12.5 bg-transparent border-2 border-effect/40 rounded-sm pl-4 pr-12 text-text font-orbit focus:outline-none focus:border-effect transition-colors placeholder:text-text/30"
                    placeholder="Repeat your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text/50 hover:text-effect transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <div className={`p-3 border font-orbit text-[14px] text-center ${message.type === 'error' ? 'border-red-500 text-red-500' : 'border-effect text-effect bg-effect/10'}`}>
                  {message.text}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-12.5 bg-mark hover:bg-mark/80 disabled:bg-mark/50 disabled:cursor-not-allowed text-white font-orbitron font-bold text-[16px] rounded-[10px] transition-all mt-2 uppercase"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

            </form>
          </div>

          {/* Sekcja profilu (coming soon) */}
          <div className="flex flex-col border border-effect/30 bg-[#E5F4FA]/5 p-6 md:p-8 opacity-50">
            <h2 className="font-orbitron font-bold text-[20px] text-brand uppercase mb-4 border-b border-effect/20 pb-2 flex justify-between items-center">
              Profile Details
              <span className="text-[10px] bg-effect text-black px-2 py-1 rounded-sm">COMING SOON</span>
            </h2>
            
            <p className="font-orbit text-[14px] text-text/70">
              Avatar and username customization options are currently under development.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}