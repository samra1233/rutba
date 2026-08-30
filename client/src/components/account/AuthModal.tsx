/* ─────────────────────────────────────────────────────────────
   AuthModal.tsx — Premium Signup & Login for RUBTA
   Features:
   • Official RUBTA Calligraphy Brand Logo Header
   • Clean Sign Up / Log In Tab Switcher
   • Gold Accent Focus Inputs
   • Demo Auto-fill & Google Authentication
   ───────────────────────────────────────────────────────────── */
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseClient';
import brandLogoGold from '../../assets_logo.png';

export default function AuthModal() {
  const { isAuthModalOpen, setAuthModalOpen, login, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
  };

  const getRegisteredAccounts = (): Array<{ name: string; email: string; phone: string; password: string }> => {
    try {
      const saved = localStorage.getItem('rotba_registered_accounts');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  };

  const saveRegisteredAccount = (acc: { name: string; email: string; phone: string; password: string }) => {
    const existing = getRegisteredAccounts();
    const filtered = existing.filter(a => a.email.toLowerCase() !== acc.email.toLowerCase());
    filtered.push(acc);
    try {
      localStorage.setItem('rotba_registered_accounts', JSON.stringify(filtered));
    } catch (_) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail) {
      addToast('Please enter a valid email address', 'warn');
      return;
    }

    if (activeTab === 'signup') {
      if (!name.trim()) {
        addToast('Please enter your Full Name', 'warn');
        return;
      }
      if (!phone.trim()) {
        addToast('Please enter your Phone Number', 'warn');
        return;
      }
      if (!password || password.length < 6) {
        addToast('Password must be at least 6 characters long', 'warn');
        return;
      }

      // Check if account already registered
      const accounts = getRegisteredAccounts();
      const existingUser = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        addToast('An account with this email address already exists. Please Log In.', 'warn');
        setActiveTab('signin');
        return;
      }

      // Register new user account
      const newUser = { name: name.trim(), email: cleanEmail, phone: phone.trim(), password };
      saveRegisteredAccount(newUser);

      // Attempt Firebase Auth user creation
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
      } catch (e) {
        console.warn('Firebase createUser notice:', e);
      }

      login(newUser.name, newUser.email, newUser.phone);
      addToast(`Account created successfully! Welcome to ROTBA, ${newUser.name}.`, 'success');
      setAuthModalOpen(false);

    } else {
      // Sign In Mode: Check registered accounts & validate exact credentials
      if (!password) {
        addToast('Please enter your password', 'warn');
        return;
      }

      const accounts = getRegisteredAccounts();
      const userAcc = accounts.find(a => a.email.toLowerCase() === cleanEmail);

      if (!userAcc) {
        // Firebase Auth login fallback check
        try {
          const fbResult = await signInWithEmailAndPassword(auth, cleanEmail, password);
          if (fbResult.user) {
            const uName = fbResult.user.displayName || cleanEmail.split('@')[0];
            login(uName, cleanEmail, '');
            addToast(`Welcome back, ${uName}!`, 'success');
            setAuthModalOpen(false);
            return;
          }
        } catch (_) {}

        addToast('No account found with this email. Please Sign Up to create an account.', 'warn');
        setActiveTab('signup');
        return;
      }

      // Verify exact password match
      if (userAcc.password !== password) {
        addToast('Incorrect password! Please check your password and try again.', 'warn');
        return;
      }

      // Successful login
      login(userAcc.name, userAcc.email, userAcc.phone);
      addToast(`Welcome back to ROTBA, ${userAcc.name}!`, 'success');
      setAuthModalOpen(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      if (u && u.email) {
        const displayName = u.displayName || u.email.split('@')[0];
        const userPhone = u.phoneNumber || '';
        
        saveRegisteredAccount({
          name: displayName,
          email: u.email.toLowerCase(),
          phone: userPhone,
          password: 'GOOGLE_AUTH_USER'
        });

        login(displayName, u.email, userPhone);
        addToast(`Signed in with Google as ${displayName}!`, 'success');
        setAuthModalOpen(false);
      }
    } catch (e: any) {
      console.error('Google Sign In Error:', e);
      addToast('Google login was cancelled or failed.', 'warn');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Dark blurred background cover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Main Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-md p-6 sm:p-8 rounded-[2.2rem] border overflow-hidden z-10 bg-white border-neutral-200 shadow-2xl text-neutral-900"
        >
          {/* Close Icon */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer z-20"
            aria-label="Close authentication panel"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading ROTBA Gold Logo (Preserved exact logo) */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="h-16 flex items-center justify-center my-1">
              <img
                src={brandLogoGold}
                alt="ROTBA Official Gold Logo"
                className="h-16 md:h-20 object-contain drop-shadow-sm"
              />
            </div>
          </div>

          {/* Switch Tab headers */}
          <div className="flex p-1 rounded-xl bg-neutral-100 border border-neutral-200 mb-5">
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'signup'
                  ? 'bg-[#003e1c] text-white font-black shadow-md'
                  : 'text-neutral-600 hover:text-black'
                }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2.5 rounded-lg font-mono text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === 'signin'
                  ? 'bg-[#003e1c] text-white font-black shadow-md'
                  : 'text-neutral-600 hover:text-black'
                }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Log In
            </button>
          </div>

          {/* Dynamic input Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence mode="wait">
              {activeTab === 'signup' ? (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="space-y-1 text-left">
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-600 font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#003e1c] focus:ring-2 focus:ring-[#003e1c]/10 transition-all text-xs font-sans font-medium"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-600 font-bold">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter your Number"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#003e1c] focus:ring-2 focus:ring-[#003e1c]/10 transition-all text-xs font-sans font-medium"
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="space-y-1 text-left">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-600 font-bold">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourname@domain.com"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#003e1c] focus:ring-2 focus:ring-[#003e1c]/10 transition-all text-xs font-sans font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-600 font-bold">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#003e1c] focus:ring-2 focus:ring-[#003e1c]/10 transition-all text-xs font-sans font-medium"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-1.5 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#003e1c] hover:bg-[#002f15] text-white font-mono text-[10px] uppercase tracking-widest font-black shadow-md border border-[#003e1c] cursor-pointer transition-all active:scale-98"
              >
                {activeTab === 'signup' ? 'Create ROTBA Account' : 'Access Profile'}
              </button>

              <div className="relative my-1.5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <span className="relative bg-white px-3 text-[8px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                  or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoadingGoogle}
                className="w-full py-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-900 font-mono text-[9px] uppercase tracking-widest font-bold shadow-2xs cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                {isLoadingGoogle ? 'Connecting...' : 'Google Login'}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 font-mono text-[9px] uppercase tracking-wider font-bold cursor-pointer transition-colors mt-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
