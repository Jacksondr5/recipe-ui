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
  image: string;
}

export type UiRecipe = Recipe & {
  thumbnail: {
    show: boolean;
  };
};
