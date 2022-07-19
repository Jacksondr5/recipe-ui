import { Recipe } from "./recipe";

export async function FetchRecipe(id: string | undefined) {
  if (!id) {
    throw new Error("id is undefined");
  }

  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  if (!baseUrl || baseUrl === "undefined") {
    throw new Error("The URL environment variable is undefined/missing");
  }

  const url = baseUrl + "/recipe/" + id;

  const response = await fetch(url);
  const data: Recipe = await response.json();
  if (!data) {
    throw new Error(
      "The fetch call did not return any data matching the Recipe Type"
    );
  }

  return data;
}
