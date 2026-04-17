import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { Story, LocalComment } from '../types';
import { useLanguage } from '../LanguageContext';
import { Download, Youtube, ArrowLeft, Loader2, MessageSquare, Edit3, Send, User, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuthState } from 'react-firebase-hooks/auth';

interface YTComment {
  id: string;
  author: string;
  authorPhoto: string;
  text: string;
  publishedAt: string;
}

export function StoryDetails() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [localComments, setLocalComments] = useState<LocalComment[]>([]);
  const [ytComments, setYtComments] = useState<YTComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { language, t } = useLanguage();
  const [user] = useAuthState(auth);
  
  const isAdmin = user?.email === 'stinger911@gmail.com';

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchYTComments = async (videoId: string) => {
    const apiKey = (import.meta as any).env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) return;

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=10&key=${apiKey}`
      );
      const data = await response.json();
      if (data.items) {
        const formatted: YTComment[] = data.items.map((item: any) => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          authorPhoto: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          text: item.snippet.topLevelComment.snippet.textDisplay,
          publishedAt: item.snippet.topLevelComment.snippet.publishedAt
        }));
        setYtComments(formatted);
      }
    } catch (error) {
      console.error('Error fetching YT comments:', error);
    }
  };

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
          const data = { id: docSnap.id, ...docSnap.data() } as Story;
          setStory(data);
          
          const videoUrl = getLangValue(data.youtubeUrl, language);
          const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
          if (videoId) {
            fetchYTComments(videoId);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `stories/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id, language]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'stories', id, 'comments'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LocalComment[];
      setLocalComments(comments);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `stories/${id}/comments`);
    });

    return () => unsubscribe();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !id) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'stories', id, 'comments'), {
        uid: user.uid,
        userName: user.displayName || 'Anonymous_User',
        userPhoto: user.photoURL || '',
        text: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `stories/${id}/comments`);
    } finally {
      setSubmitting(false);
    }
  };

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
      <div className="mb-12 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-3 metadata-label hover:text-cyber-cyan transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t('BACK TO TERMINAL', 'НАЗАД К ТЕРМИНАЛУ')}
        </Link>
        
        {isAdmin && (
          <Link 
            to={`/admin/edit/${id}`}
            className="metadata-label text-cyber-red hover:neon-text-red transition-all flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" />
            {t('// EDIT_ENTRY', '// РЕДАКТИРОВАТЬ_ЗАПИСЬ')}
          </Link>
        )}
      </div>

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
                        {t('GLOBAL_INTEL_FEED', 'ГЛОБАЛЬНЫЙ_ПОТОК_ДАННЫХ')}
                      </span>
                    </div>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {ytComments.length > 0 ? (
                        ytComments.map(comment => (
                          <div key={comment.id} className="border-l border-cyber-red/20 bg-cyber-black/40 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <img src={comment.authorPhoto} alt={comment.author} className="h-5 w-5 rounded-full border border-cyber-red/30" referrerPolicy="no-referrer" />
                              <span className="metadata-label text-[10px] text-cyber-red">{comment.author}</span>
                              <span className="metadata-label text-[8px] opacity-30 ml-auto">
                                {new Date(comment.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: comment.text }} />
                          </div>
                        ))
                      ) : (
                        <div className="border-l-2 border-cyber-cyan/20 bg-cyber-black/40 p-4">
                          <p className="text-xs text-gray-500 font-mono italic">
                            {t('// EXTERNAL_COMMENTS_SYNCED_WITH_YOUTUBE_PLATFORM', '// ВНЕШНИЕ_КОММЕНТАРИИ_СИНХРОНИЗИРОВАНЫ_С_YOUTUBE')}
                          </p>
                        </div>
                      )}
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

                    {/* Local Comments Section */}
                    <div className="border-t border-cyber-cyan/10 pt-8 mt-12">
                      <div className="flex items-center gap-3 text-cyber-amber mb-6">
                        <Shield className="h-5 w-5" />
                        <span className="metadata-label font-bold">
                          {t('LOCAL ARCHIVE TERMINAL', 'МЕСТНЫЙ ТЕРМИНАЛ АРХИВА')}
                        </span>
                      </div>

                      {user ? (
                        <form onSubmit={handlePostComment} className="mb-8 space-y-4">
                          <div className="relative">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder={t('Transmit your thoughts to the archive...', 'Передайте ваши мысли в архив...')}
                              className="w-full bg-cyber-black/60 border border-cyber-cyan/20 p-4 text-xs font-sans text-white focus:border-cyber-cyan outline-none transition-colors min-h-[80px]"
                              required
                            />
                            <div className="absolute top-0 right-0 p-2 pointer-events-none opacity-10">
                              <div className="h-2 w-2 bg-cyber-cyan animate-pulse" />
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="cyber-button-primary w-full py-2 flex items-center justify-center gap-2"
                          >
                            {submitting ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Send className="h-3 w-3" />
                            )}
                            {t('UPLOAD_DATA', 'ЗАГРУЗИТЬ_ДАННЫЕ')}
                          </button>
                        </form>
                      ) : (
                        <div className="bg-cyber-dark/60 border border-cyber-red/20 p-4 mb-8">
                          <p className="text-[10px] text-cyber-red font-mono text-center uppercase tracking-widest">
                            {t('// AUTH_REQUIRED_FOR_TERMINAL_ACCESS', '// ТРЕБУЕТСЯ_АВТОРИЗАЦИЯ_ДЛЯ_ДОСТУПА_К_ТЕРМИНАЛУ')}
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {localComments.map(comment => (
                          <div key={comment.id} className="bg-cyber-dark/20 border border-cyber-cyan/5 p-4 space-y-2 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-cyan opacity-20" />
                            <div className="flex items-center gap-2">
                              {comment.userPhoto ? (
                                <img src={comment.userPhoto} alt={comment.userName} className="h-6 w-6 rounded-full border border-cyber-cyan/30" referrerPolicy="no-referrer" />
                              ) : (
                                <User className="h-6 w-6 p-1 rounded-full border border-cyber-cyan/30 text-cyber-cyan" />
                              )}
                              <div>
                                <span className="metadata-label text-[10px] text-cyber-cyan block leading-none">{comment.userName}</span>
                                <span className="text-[8px] opacity-30 font-mono">
                                  {comment.createdAt?.toDate?.() ? new Date(comment.createdAt.toDate()).toLocaleString() : 'PENDING...'}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-300 font-sans leading-relaxed pl-8">
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

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
