
export interface Item {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  isNew?: boolean;
}

export type RecipeMap = Record<string, [string, string]>;
