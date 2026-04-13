import React from 'react';
import { useLanguage } from './LanguageContext';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Globe, LogIn, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const isAdmin = user?.email === 'stinger911@gmail.com';

  return (
    <header className="sticky top-0 z-50 border-b border-cyber-cyan/30 bg-cyber-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-cyber-cyan shadow-neon-cyan" />
          <span className="font-mono text-xl font-bold tracking-tighter text-cyber-cyan neon-text-cyan">
            {t('BEHIND THE WALL', 'ЗА СТЕНОЙ')}
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-full border border-cyber-cyan/30 bg-cyber-dark px-3 py-1">
            <Globe className="h-4 w-4 text-cyber-cyan" />
            <button
              onClick={() => setLanguage('en')}
              className={`text-xs font-bold transition-colors ${
                language === 'en' ? 'text-cyber-cyan' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              EN
            </button>
            <span className="text-gray-700">|</span>
            <button
              onClick={() => setLanguage('ru')}
              className={`text-xs font-bold transition-colors ${
                language === 'ru' ? 'text-cyber-cyan' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              RU
            </button>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-xs font-bold text-cyber-pink hover:neon-text-pink transition-all"
            >
              <Shield className="h-4 w-4" />
              {t('ADMIN', 'АДМИН')}
            </Link>
          )}

          {user ? (
            <button
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('LOGOUT', 'ВЫХОД')}</span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="cyber-button flex items-center gap-2 bg-cyber-cyan/10 text-xs font-bold text-cyber-cyan hover:bg-cyber-cyan/20"
            >
              <LogIn className="h-4 w-4" />
              <span>{t('LOGIN', 'ВХОД')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
