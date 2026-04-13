import React from 'react';
import { StoryList } from '../components/StoryList';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';

export function Home() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block border-y border-cyber-cyan/30 px-8 py-4 mb-6"
        >
          <h1 className="font-mono text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl">
            {t('BEHIND THE ', 'ЗА ')}
            <span className="text-cyber-cyan neon-text-cyan">{t('WALL', 'СТЕНОЙ')}</span>
          </h1>
        </motion.div>
        <p className="mx-auto max-w-2xl text-lg text-gray-400 font-mono uppercase tracking-widest">
          {t('Cyberpunk stories from the edge of reality.', 'Киберпанк истории с края реальности.')}
        </p>
      </section>

      <StoryList />
    </main>
  );
}
