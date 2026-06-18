export interface Shayari {
  id: string;
  text: string;
  language: string;
  category?: string | null;
  mood?: string | null;
  author?: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}
