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
  starred: Boolean;
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

export interface NumberIngredient {
  ingredient: string;
  starred: number;
}

export interface AmbiguousIngredient {
  ingredient: string;
  starred: number | boolean;
}

export type NumberRecipe = Omit<Recipe, "ingredients"> & {
  ingredients: NumberIngredient[];
};

export type AmbiguousRecipe = Omit<Recipe, "ingredients"> & {
  ingredients: AmbiguousIngredient[];
};
