export type Language = 'en' | 'ru';

export interface Story {
  id: string;
  title: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  thumbnailUrl: string;
  youtubeUrl?: string;
  downloads: {
    fb2?: string;
    epub?: string;
    pdf?: string;
  };
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}
