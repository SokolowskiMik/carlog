export interface Note {
    id?: string;
    title: string;
    description: string;
    images: string[];
    audioUrl?: string | null;
    createdAt?: any;
    updatedAt?: any;
  }