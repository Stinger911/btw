import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Story } from '../types';
import { StoryCard } from './StoryCard';
import { useLanguage } from '../LanguageContext';
import { Loader2 } from 'lucide-react';

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const storiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Story[];
      setStories(storiesData);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'stories');
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-cyan" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="font-mono text-gray-500 uppercase tracking-widest">
          {t('No stories found in the matrix.', 'Истории не найдены в матрице.')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
