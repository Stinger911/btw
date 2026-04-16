import React from 'react';
import { Story } from '../types';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Download, Youtube } from 'lucide-react';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const { language, t } = useLanguage();

  // Helper to safely access nested language data or fallback to legacy top-level data
  const getLangValue = (obj: any, lang: string) => {
    if (obj && typeof obj === 'object') return obj[lang] || '';
    return typeof obj === 'string' ? obj : '';
  };

  const currentThumbnail = getLangValue(story.thumbnailUrl, language);
  const currentYoutube = getLangValue(story.youtubeUrl, language);
  
  const getDownloads = () => {
    if (story.downloads && typeof (story.downloads as any)[language] === 'object' && (story.downloads as any)[language] !== null) {
      return (story.downloads as any)[language];
    }
    return story.downloads || {};
  };

  const currentDownloads = getDownloads() || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="cyber-card group"
    >
      <div className="scanline" />
      <Link to={`/story/${story.id}`} className="block">
        <div className="aspect-[16/9] overflow-hidden relative">
          <img
            src={currentThumbnail}
            alt={story.title[language]}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-4 right-4">
            <span className="metadata-label bg-cyber-black/60 px-2 py-1 backdrop-blur-sm">
              {new Date(story.createdAt?.toDate?.() || story.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-cyber-cyan neon-text-cyan group-hover:text-white transition-colors">
              {story.title[language]}
            </h3>
            <div className="flex gap-3">
              {currentYoutube && <Youtube className="h-4 w-4 text-cyber-red" />}
              {Object.keys(currentDownloads).length > 0 && <Download className="h-4 w-4 text-cyber-amber" />}
            </div>
          </div>
          <p className="line-clamp-2 text-sm text-gray-400 leading-relaxed font-sans">
            {story.description[language]}
          </p>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="metadata-label text-[9px] opacity-40">
              ID: {story.id.slice(0, 8)}
            </span>
            <span className="font-display text-xs font-bold text-cyber-cyan opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
              {t('> ACCESS_DATA', '> ДОСТУП_К_ДАННЫМ')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
