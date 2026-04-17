import React, { useState } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';
import { Plus, Save, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Admin() {
  const { t } = useLanguage();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'ru'>('en');
  
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
      await addDoc(collection(db, 'stories'), {
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
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setFormData({
        en: { title: '', description: '', thumbnailUrl: '', youtubeUrl: '', fb2: '', epub: '', pdf: '' },
        ru: { title: '', description: '', thumbnailUrl: '', youtubeUrl: '', fb2: '', epub: '', pdf: '' }
      });
      alert(t('Story added successfully!', 'История успешно добавлена!'));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'stories');
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
      <div className="mb-12 border-b border-cyber-cyan/10 pb-8">
        <span className="metadata-label text-cyber-red mb-2 block">{t('// SYSTEM_ADMIN_TERMINAL', '// ТЕРМИНАЛ_СИСТЕМНОГО_АДМИНИСТРАТОРА')}</span>
        <h1 className="font-display text-5xl font-black text-white">{t('INITIALIZE DATA', 'ИНИЦИАЛИЗАЦИЯ ДАННЫХ')}</h1>
      </div>

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
                {loading ? t('PROCESSING...', 'ОБРАБОТКА...') : t('UPLOAD TO ARCHIVE', 'ЗАГРУЗИТЬ В АРХИВ')}
              </button>
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
    </div>
  );
}
