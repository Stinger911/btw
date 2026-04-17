import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';
import { Plus, Save, X, Loader2, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Story } from '../types';

export function Admin() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'ru'>('en');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    en: {
      title: '',
      description: '',
      thumbnailUrl: '',
      youtubeUrl: '',
      fb2: '',
      epub: '',
      pdf: ''
    },
    ru: {
      title: '',
      description: '',
      thumbnailUrl: '',
      youtubeUrl: '',
      fb2: '',
      epub: '',
      pdf: ''
    }
  });

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) return;
      setFetching(true);
      try {
        const docRef = doc(db, 'stories', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const storyData = docSnap.data() as Story;
          
          const getLangVal = (field: any, lang: 'en' | 'ru') => {
            if (field && typeof field === 'object') return field[lang] || '';
            return typeof field === 'string' ? field : '';
          };

          const getDownload = (lang: 'en' | 'ru', type: 'fb2' | 'epub' | 'pdf') => {
            if (storyData.downloads && (storyData.downloads as any)[lang]) {
              return (storyData.downloads as any)[lang][type] || '';
            }
            if (storyData.downloads && typeof (storyData.downloads as any)[type] === 'string') {
               return (storyData.downloads as any)[type];
            }
            return '';
          };

          setFormData({
            en: {
              title: getLangVal(storyData.title, 'en'),
              description: getLangVal(storyData.description, 'en'),
              thumbnailUrl: getLangVal(storyData.thumbnailUrl, 'en'),
              youtubeUrl: getLangVal(storyData.youtubeUrl, 'en'),
              fb2: getDownload('en', 'fb2'),
              epub: getDownload('en', 'epub'),
              pdf: getDownload('en', 'pdf')
            },
            ru: {
              title: getLangVal(storyData.title, 'ru'),
              description: getLangVal(storyData.description, 'ru'),
              thumbnailUrl: getLangVal(storyData.thumbnailUrl, 'ru'),
              youtubeUrl: getLangVal(storyData.youtubeUrl, 'ru'),
              fb2: getDownload('ru', 'fb2'),
              epub: getDownload('ru', 'epub'),
              pdf: getDownload('ru', 'pdf')
            }
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `stories/${id}`);
      } finally {
        setFetching(false);
      }
    };

    fetchStory();
  }, [id]);

  const updateField = (lang: 'en' | 'ru', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const storyPayload = {
        title: {
          en: formData.en.title,
          ru: formData.ru.title
        },
        description: {
          en: formData.en.description,
          ru: formData.ru.description
        },
        thumbnailUrl: {
          en: formData.en.thumbnailUrl,
          ru: formData.ru.thumbnailUrl
        },
        youtubeUrl: {
          en: formData.en.youtubeUrl,
          ru: formData.ru.youtubeUrl
        },
        downloads: {
          en: {
            ...(formData.en.fb2 && { fb2: formData.en.fb2 }),
            ...(formData.en.epub && { epub: formData.en.epub }),
            ...(formData.en.pdf && { pdf: formData.en.pdf })
          },
          ru: {
            ...(formData.ru.fb2 && { fb2: formData.ru.fb2 }),
            ...(formData.ru.epub && { epub: formData.ru.epub }),
            ...(formData.ru.pdf && { pdf: formData.ru.pdf })
          }
        },
        updatedAt: serverTimestamp(),
        ...(!id && { createdAt: serverTimestamp() })
      };

      if (id) {
        await updateDoc(doc(db, 'stories', id), storyPayload);
        navigate('/');
      } else {
        await addDoc(collection(db, 'stories'), storyPayload);
        // Reset form
        setFormData({
          en: { title: '', description: '', thumbnailUrl: '', youtubeUrl: '', fb2: '', epub: '', pdf: '' },
          ru: { title: '', description: '', thumbnailUrl: '', youtubeUrl: '', fb2: '', epub: '', pdf: '' }
        });
      }
    } catch (error) {
      handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, 'stories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'stories', id));
      navigate('/');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `stories/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = (lang: 'en' | 'ru') => (
    <div className="space-y-12">
      <div className="space-y-2">
        <label className="metadata-label">{t('TITLE', 'ЗАГОЛОВОК')} ({lang.toUpperCase()})</label>
        <input
          type="text"
          required
          value={formData[lang].title}
          onChange={(e) => updateField(lang, 'title', e.target.value)}
          className="w-full border-b-2 border-cyber-cyan/20 bg-transparent py-2 font-display text-xl text-white outline-none transition-colors focus:border-cyber-cyan"
        />
      </div>

      <div className="space-y-2">
        <label className="metadata-label">{t('DESCRIPTION', 'ОПИСАНИЕ')} ({lang.toUpperCase()})</label>
        <textarea
          required
          rows={4}
          value={formData[lang].description}
          onChange={(e) => updateField(lang, 'description', e.target.value)}
          className="w-full border-b-2 border-cyber-cyan/20 bg-transparent py-2 font-sans text-gray-300 outline-none transition-colors focus:border-cyber-cyan"
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="metadata-label">{t('THUMBNAIL URL', 'URL МИНИАТЮРЫ')} ({lang.toUpperCase()})</label>
          <input
            type="url"
            required
            value={formData[lang].thumbnailUrl}
            onChange={(e) => updateField(lang, 'thumbnailUrl', e.target.value)}
            className="w-full border-b-2 border-cyber-cyan/20 bg-transparent py-2 font-mono text-sm text-cyber-cyan outline-none transition-colors focus:border-cyber-cyan"
          />
        </div>
        <div className="space-y-2">
          <label className="metadata-label">{t('YOUTUBE URL', 'URL YOUTUBE')} ({lang.toUpperCase()})</label>
          <input
            type="url"
            value={formData[lang].youtubeUrl}
            onChange={(e) => updateField(lang, 'youtubeUrl', e.target.value)}
            className="w-full border-b-2 border-cyber-cyan/20 bg-transparent py-2 font-mono text-sm text-cyber-red outline-none transition-colors focus:border-cyber-cyan"
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="metadata-label text-cyber-amber">{t('// DOWNLOAD_LINKS', '// ССЫЛКИ_НА_СКАЧИВАНИЕ')} ({lang.toUpperCase()})</h3>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="metadata-label">FB2 URL</label>
            <input
              type="url"
              value={formData[lang].fb2}
              onChange={(e) => updateField(lang, 'fb2', e.target.value)}
              className="w-full border-b-2 border-cyber-cyan/20 bg-transparent py-2 font-mono text-xs outline-none transition-colors focus:border-cyber-cyan"
            />
          </div>
          <div className="space-y-2">
            <label className="metadata-label">EPUB URL</label>
            <input
              type="url"
              value={formData[lang].epub}
              onChange={(e) => updateField(lang, 'epub', e.target.value)}
              className="w-full border-b-2 border-cyber-cyan/20 bg-transparent py-2 font-mono text-xs outline-none transition-colors focus:border-cyber-cyan"
            />
          </div>
          <div className="space-y-2">
            <label className="metadata-label">PDF URL</label>
            <input
              type="url"
              value={formData[lang].pdf}
              onChange={(e) => updateField(lang, 'pdf', e.target.value)}
              className="w-full border-b-2 border-cyber-cyan/20 bg-transparent py-2 font-mono text-xs outline-none transition-colors focus:border-cyber-cyan"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="mb-12 border-b border-cyber-cyan/10 pb-8 flex items-end justify-between">
        <div>
          <span className="metadata-label text-cyber-red mb-2 block">{t('// SYSTEM_ADMIN_TERMINAL', '// ТЕРМИНАЛ_СИСТЕМНОГО_АДМИНИСТРАТОРА')}</span>
          <h1 className="font-display text-5xl font-black text-white">
            {id ? t('UPDATE ARCHIVE', 'ОБНОВЛЕНИЕ АРХИВА') : t('INITIALIZE DATA', 'ИНИЦИАЛИЗАЦИЯ ДАННЫХ')}
          </h1>
        </div>
        {id && (
          <button 
            onClick={() => navigate('/admin')}
            className="metadata-label text-cyber-cyan hover:text-white transition-colors mb-2 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> {t('CREATE NEW', 'СОЗДАТЬ НОВУЮ')}
          </button>
        )}
      </div>

      {fetching ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-cyan" />
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 flex gap-4 border-b border-cyber-cyan/10 pb-4">
              <button
                onClick={() => setActiveTab('en')}
                className={`bracket-nav ${activeTab === 'en' ? 'active' : 'text-gray-500 hover:text-gray-300'}`}
              >
                ENGLISH_DATA
              </button>
              <button
                onClick={() => setActiveTab('ru')}
                className={`bracket-nav ${activeTab === 'ru' ? 'active' : 'text-gray-500 hover:text-gray-300'}`}
              >
                RUSSIAN_DATA
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {activeTab === 'en' ? renderFormFields('en') : renderFormFields('ru')}

              <div className="pt-8 border-t border-cyber-cyan/10">
                <button
                  type="submit"
                  disabled={loading}
                  className="cyber-button-primary w-full py-4 text-xl"
                >
                  {loading ? t('PROCESSING...', 'ОБРАБОТКА...') : (id ? t('PATCH INFOSPHERE', 'ОБНОВИТЬ ИНФОСФЕРУ') : t('UPLOAD TO ARCHIVE', 'ЗАГРУЗИТЬ В АРХИВ'))}
                </button>

                {id && (
                  <div className="mt-4 space-y-2">
                    {!showDeleteConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={loading}
                        className="w-full border-2 border-cyber-red/30 bg-cyber-red/5 py-4 font-display text-xl text-cyber-red transition-all hover:bg-cyber-red hover:text-white"
                      >
                        {t('DELETE FROM ARCHIVE', 'УДАЛИТЬ ИЗ АРХИВА')}
                      </button>
                    ) : (
                      <div className="space-y-4 rounded border border-cyber-red p-4 bg-cyber-red/10">
                        <p className="text-center font-mono text-xs text-cyber-red uppercase font-bold">
                          {t('CRITICAL: Confirm data deletion?', 'КРИТИЧЕСКИ: Подтвердить удаление данных?')}
                        </p>
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 bg-cyber-red py-2 font-display text-sm text-white hover:bg-white hover:text-cyber-black"
                          >
                            {t('CONFIRM', 'ПОДТВЕРДИТЬ')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={loading}
                            className="flex-1 border border-gray-500 py-2 font-display text-sm text-gray-400 hover:text-white"
                          >
                            {t('ABORT', 'ОТМЕНА')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

        <div className="space-y-8">
          <div className="cyber-card p-6 border-cyber-red">
            <div className="scanline" />
            <h3 className="metadata-label text-cyber-red mb-4">{t('// SECURITY_NOTICE', '// УВЕДОМЛЕНИЕ_О_БЕЗОПАСНОСТИ')}</h3>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">
              {t('All data entries are permanent and encrypted. Ensure all metadata is verified before initialization.', 'Все записи данных являются постоянными и зашифрованными. Убедитесь, что все метаданные проверены перед инициализацией.')}
            </p>
          </div>

          <div className="cyber-card p-6 border-cyber-amber">
            <div className="scanline" />
            <h3 className="metadata-label text-cyber-amber mb-4">{t('// SYSTEM_STATUS', '// СТАТУС_СИСТЕМЫ')}</h3>
            <div className="space-y-2 font-mono text-[10px] text-gray-500">
              <div className="flex justify-between">
                <span>DATABASE:</span>
                <span className="text-cyber-cyan">CONNECTED</span>
              </div>
              <div className="flex justify-between">
                <span>ENCRYPTION:</span>
                <span className="text-cyber-cyan">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>UPLOADER:</span>
                <span className="text-white">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
