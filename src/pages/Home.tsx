import React from 'react';
import { StoryList } from '../components/StoryList';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import banner from '../assets/banner.png';

export function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen">
      {/* Hero Section with Background */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 bg-cyber-black"
          style={{ 
            backgroundImage: `url(${banner})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            opacity: 0.4
          }}
        />
        {/* Scanline / Grid Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-cyber-black/20 via-cyber-black/60 to-cyber-black cyber-grid opacity-40" />
        <div className="scanline z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-cyber-cyan/40" />
            <span className="metadata-label">{t('ESTABLISHED // 2026', 'ОСНОВАНО // 2026')}</span>
            <div className="h-[1px] w-12 bg-cyber-cyan/40" />
          </div>

          <h1 className="font-display text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl mb-8">
            {t('BEHIND THE ', 'ЗА ')}
            <span className="text-cyber-cyan neon-text-cyan">{t('WALL', 'СТЕНОЙ')}</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-gray-400 font-display uppercase tracking-widest leading-tight">
            {t('Cyberpunk tales of humanity in a distorted world.', 'Киберпанк рассказы о человеке в искаженном мире.')}
          </p>

          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="h-12 w-[1px] bg-cyber-cyan/20" />
            <span className="metadata-label text-cyber-cyan/60">{t('SCROLL TO ACCESS', 'ПРОКРУТИТЕ ДЛЯ ДОСТУПА')}</span>
            <div className="h-12 w-[1px] bg-cyber-cyan/20" />
          </div>
        </motion.div>
      </section>

      <div className="bg-cyber-dark/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex items-end justify-between border-b border-cyber-cyan/10 pb-8">
            <div>
              <span className="metadata-label text-cyber-cyan mb-2 block">{t('// ARCHIVE_INDEX', '// ИНДЕКС_АРХИВА')}</span>
              <h2 className="font-display text-4xl font-bold">{t('LATEST ENTRIES', 'ПОСЛЕДНИЕ ЗАПИСИ')}</h2>
            </div>
            <div className="hidden sm:block text-right">
              <span className="metadata-label opacity-40">{t('STATUS: ONLINE', 'СТАТУС: ОНЛАЙН')}</span>
            </div>
          </div>
          <StoryList />
        </div>
      </div>
    </main>
  );
}
