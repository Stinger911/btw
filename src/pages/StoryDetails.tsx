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

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-gray-500 hover:text-cyber-cyan transition-colors">
        <ArrowLeft className="h-4 w-4" />
        {t('BACK TO LIST', 'НАЗАД К СПИСКУ')}
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="cyber-border overflow-hidden rounded-lg">
            <img
              src={story.thumbnailUrl}
              alt={story.title[language]}
              referrerPolicy="no-referrer"
              className="w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h1 className="mb-4 font-mono text-4xl font-bold text-cyber-cyan neon-text-cyan">
            {story.title[language]}
          </h1>
          
          <div className="mb-8 prose prose-invert max-w-none text-gray-300 leading-relaxed">
            {story.description[language]}
          </div>

          <div className="mt-auto space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {story.downloads.fb2 && (
                <a
                  href={story.downloads.fb2}
                  className="cyber-button flex items-center justify-center gap-2 bg-cyber-yellow/10 text-cyber-yellow hover:bg-cyber-yellow/20"
                >
                  <Download className="h-4 w-4" />
                  FB2
                </a>
              )}
              {story.downloads.epub && (
                <a
                  href={story.downloads.epub}
                  className="cyber-button flex items-center justify-center gap-2 bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20"
                >
                  <Download className="h-4 w-4" />
                  EPUB
                </a>
              )}
              {story.downloads.pdf && (
                <a
                  href={story.downloads.pdf}
                  className="cyber-button flex items-center justify-center gap-2 bg-cyber-pink/10 text-cyber-pink hover:bg-cyber-pink/20"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </a>
              )}
            </div>

            {story.youtubeUrl && (
              <div className="rounded-lg border border-cyber-pink/30 bg-cyber-pink/5 p-6">
                <div className="mb-4 flex items-center gap-3 text-cyber-pink">
                  <Youtube className="h-6 w-6" />
                  <h3 className="font-mono font-bold uppercase tracking-wider">
                    {t('YOUTUBE INTEGRATION', 'YOUTUBE ИНТЕГРАЦИЯ')}
                  </h3>
                </div>
                <p className="mb-6 text-sm text-gray-400">
                  {t('Watch the video and join the discussion on YouTube.', 'Смотрите видео и присоединяйтесь к обсуждению на YouTube.')}
                </p>
                <a
                  href={story.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-button flex w-full items-center justify-center gap-2 bg-cyber-pink/20 text-cyber-pink hover:bg-cyber-pink/30"
                >
                  <MessageSquare className="h-4 w-4" />
                  {t('LEAVE A COMMENT ON YOUTUBE', 'ОСТАВИТЬ КОММЕНТАРИЙ НА YOUTUBE')}
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
