import { Recipe } from "./recipe";

export const emptyRecipe: Recipe = {
  id: 0,
  name: "0",
  thumbnail: {
    image: "",
  },
  description: "",
  link: ["0"],
  metadata: {
    lastViewed: "0",
    created: "0",
    timeToCook: "0",
  },
  ingredients: [
    {
      ingredient: "",
      starred: true,
    },
  ],
  steps: [
    {
      step: 0,
      directions: "",
      image: "",
    },
  ],
};
