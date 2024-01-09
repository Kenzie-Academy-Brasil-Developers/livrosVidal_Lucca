export interface Book {
    id: number;
    name: string;
    pages: number;
    category?: string; 
    createdAt: Date;
    updatedAt: Date;
  }