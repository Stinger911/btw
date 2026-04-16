import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Story } from '../types';
import { useLanguage } from '../LanguageContext';
import { Download, Youtube, ArrowLeft, Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export function StoryDetails() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  // Helper to safely access nested language data or fallback to legacy top-level data
  const getLangValue = (obj: any, lang: string) => {
    if (obj && typeof obj === 'object') return obj[lang] || '';
    return typeof obj === 'string' ? obj : '';
  };

  useEffect(() => {
    if (!id) return;
    const fetchStory = async () => {
      try {
        const docRef = doc(db, 'stories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStory({ id: docSnap.id, ...docSnap.data() } as Story);
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-cyber-cyan" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-cyber-pink">{t('STORY NOT FOUND', 'ИСТОРИЯ НЕ НАЙДЕНА')}</h2>
        <Link to="/" className="mt-4 inline-block text-cyber-cyan hover:underline">
          {t('Back to home', 'Вернуться на главную')}
        </Link>
      </div>
    );
  }

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
    <div className="container mx-auto px-6 py-16">
      <Link to="/" className="mb-12 inline-flex items-center gap-3 metadata-label hover:text-cyber-cyan transition-colors group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t('BACK TO TERMINAL', 'НАЗАД К ТЕРМИНАЛУ')}
      </Link>

      <div className="grid gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="cyber-card p-2">
            <div className="scanline" />
            <img
              src={currentThumbnail}
              alt={story.title[language]}
              referrerPolicy="no-referrer"
              className="w-full object-cover"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <span className="metadata-label opacity-40">{t('VISUAL_ID: ', 'ВИЗУАЛЬНЫЙ_ID: ')}{story.id.slice(0, 12)}</span>
            <span className="metadata-label opacity-40">{t('SOURCE: ENCRYPTED', 'ИСТОЧНИК: ЗАШИФРОВАНО')}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <span className="metadata-label text-cyber-cyan mb-2 block">{t('// DATA_ENTRY', '// ЗАПИСЬ_ДАННЫХ')}</span>
            <h1 className="font-display text-5xl font-black text-white neon-text-cyan leading-none">
              {story.title[language]}
            </h1>
          </div>
          
          <div className="mb-12 prose prose-invert max-w-none text-gray-400 leading-relaxed font-sans text-lg">
            {story.description[language]}
          </div>

          <div className="mt-auto space-y-12">
            <div>
              <span className="metadata-label mb-4 block">{t('// DOWNLOAD_PROTOCOLS', '// ПРОТОКОЛЫ_ЗАГРУЗКИ')}</span>
              <div className="grid gap-4 sm:grid-cols-3">
                {currentDownloads?.fb2 && (
                  <a
                    href={currentDownloads.fb2}
                    className="cyber-button-secondary flex items-center justify-center gap-2 border-cyber-amber/30 text-cyber-amber hover:bg-cyber-amber/10"
                  >
                    <Download className="h-4 w-4" />
                    FB2
                  </a>
                )}
                {currentDownloads?.epub && (
                  <a
                    href={currentDownloads.epub}
                    className="cyber-button-secondary flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    EPUB
                  </a>
                )}
                {currentDownloads?.pdf && (
                  <a
                    href={currentDownloads.pdf}
                    className="cyber-button-secondary flex items-center justify-center gap-2 border-cyber-red/30 text-cyber-red hover:bg-cyber-red/10"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                )}
              </div>
            </div>

            {currentYoutube && (
              <div className="space-y-6 border-t border-cyber-cyan/10 pt-12">
                <div className="bg-cyber-dark/40 p-8 relative overflow-hidden">
                  <div className="scanline" />
                  <div className="mb-6 flex items-center gap-4 text-cyber-red">
                    <Youtube className="h-6 w-6" />
                    <h3 className="font-display font-bold text-xl tracking-wider">
                      {t('VISUAL_FEED_INTEGRATION', 'ИНТЕГРАЦИЯ_ВИДЕОПОТОКА')}
                    </h3>
                  </div>
                  
                  <div className="aspect-video mb-8 border border-cyber-red/20 overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${currentYoutube.split('v=')[1]?.split('&')[0] || currentYoutube.split('/').pop()}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-cyber-cyan">
                      <MessageSquare className="h-5 w-5" />
                      <span className="metadata-label font-bold">
                        {t('COMM_CHANNEL', 'КАНАЛ_СВЯЗИ')}
                      </span>
                    </div>
                    
                    <div className="border-l-2 border-cyber-cyan/20 bg-cyber-black/40 p-4">
                      <p className="text-xs text-gray-500 font-mono italic">
                        {t('// EXTERNAL_COMMENTS_SYNCED_WITH_YOUTUBE_PLATFORM', '// ВНЕШНИЕ_КОММЕНТАРИИ_СИНХРОНИЗИРОВАНЫ_С_YOUTUBE')}
                      </p>
                    </div>

                    <a
                      href={currentYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-button-primary flex w-full items-center justify-center gap-3 bg-cyber-red text-white hover:bg-white hover:text-cyber-black"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {t('TRANSMIT COMMENT TO YOUTUBE', 'ПЕРЕДАТЬ КОММЕНТАРИЙ В YOUTUBE')}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
