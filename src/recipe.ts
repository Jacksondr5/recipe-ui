export interface Recipe {
  id: number;
  name: string;
  thumbnail: Thumbnail;
  description: string;
  link: string[];
  metadata: Metadata;
  ingredients: Ingredient[];
  steps: Steps[];
}

export interface Thumbnail {
  image: string;
  show: boolean;
}

export interface Ingredient {
  ingredient: string;
  starred: boolean;
}

export interface Metadata {
  lastViewed: string;
  created: string;
  timeToCook: string;
}

export interface Steps {
  step: number;
  directions: string;
}
