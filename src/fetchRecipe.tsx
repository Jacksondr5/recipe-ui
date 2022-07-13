import { Recipe } from "./recipe";
import { useParams } from "react-router-dom";

export function FetchRecipe() {
  const id = useParams().recipeId;
  if (!id) {
    throw new Error("id is undefined");
  }

  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  if (!baseUrl || baseUrl === "undefined") {
    throw new Error("The URL environment variable is undefined/missing");
  }

  return baseUrl + "/recipe/" + id;
}
