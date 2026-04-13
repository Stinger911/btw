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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden bg-cyber-dark border border-cyber-cyan/20 transition-all hover:border-cyber-cyan/50 hover:shadow-neon-cyan/20"
    >
      <Link to={`/story/${story.id}`} className="block">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={story.thumbnailUrl}
            alt={story.title[language]}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-mono text-lg font-bold text-cyber-cyan neon-text-cyan">
              {story.title[language]}
            </h3>
            <div className="flex gap-2">
              {story.youtubeUrl && <Youtube className="h-4 w-4 text-cyber-pink" />}
              {Object.keys(story.downloads).length > 0 && <Download className="h-4 w-4 text-cyber-yellow" />}
            </div>
          </div>
          <p className="line-clamp-3 text-sm text-gray-400 leading-relaxed">
            {story.description[language]}
          </p>
          
          <div className="mt-4 flex items-center justify-between border-t border-cyber-cyan/10 pt-4">
            <span className="font-mono text-[10px] text-gray-600 uppercase">
              {new Date(story.createdAt?.toDate?.() || story.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs font-bold text-cyber-cyan opacity-0 transition-opacity group-hover:opacity-100">
              {t('READ MORE →', 'ЧИТАТЬ ДАЛЕЕ →')}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
