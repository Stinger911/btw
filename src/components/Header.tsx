import React from 'react';
import { useLanguage } from '../LanguageContext';
import { auth } from '../firebase';
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
    <header className="sticky top-0 z-50 border-b border-cyber-cyan/10 bg-cyber-black/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-6 w-6 bg-cyber-cyan" />
          <span className="font-display text-2xl font-black tracking-tighter text-cyber-cyan neon-text-cyan">
            {t('BEHIND THE WALL', 'ЗА СТЕНОЙ')}
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className="bracket-nav active">
              {t('TERMINAL', 'ТЕРМИНАЛ')}
            </Link>
          </nav>

          <div className="flex items-center gap-4 border-l border-cyber-cyan/10 pl-6">
            <div className="flex items-center gap-2 font-display text-[10px] font-bold tracking-widest text-gray-500">
              <button
                onClick={() => setLanguage('en')}
                className={`transition-colors ${language === 'en' ? 'text-cyber-cyan' : 'hover:text-gray-300'}`}
              >
                EN
              </button>
              <span>/</span>
              <button
                onClick={() => setLanguage('ru')}
                className={`transition-colors ${language === 'ru' ? 'text-cyber-cyan' : 'hover:text-gray-300'}`}
              >
                RU
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="metadata-label text-cyber-red hover:neon-text-red transition-all"
              >
                {t('// ADMIN_ACCESS', '// АДМИН_ДОСТУП')}
              </Link>
            )}

            {user ? (
              <button
                onClick={() => signOut(auth)}
                className="metadata-label hover:text-white transition-colors"
              >
                {t('LOGOUT', 'ВЫХОД')}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="cyber-button-primary text-xs"
              >
                {t('LOGIN', 'ВХОД')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
