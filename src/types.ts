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
  thumbnailUrl: {
    en: string;
    ru: string;
  };
  youtubeUrl: {
    en: string;
    ru: string;
  };
  downloads: {
    en: {
      fb2?: string;
      epub?: string;
      pdf?: string;
    };
    ru: {
      fb2?: string;
      epub?: string;
      pdf?: string;
    };
  };
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LocalComment {
  id: string;
  uid: string;
  userName: string;
  userPhoto?: string;
  text: string;
  createdAt: any;
}
