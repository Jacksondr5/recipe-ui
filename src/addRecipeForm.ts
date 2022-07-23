export interface AddRecipeForm {
  name: string;
  thumbnail: string;
  description: string;
  timetocook: string;
  ingredients: { starred: number; ingredient: string }[];
  steps: { directions: string; image: string }[];
  recommendations: [];
}
