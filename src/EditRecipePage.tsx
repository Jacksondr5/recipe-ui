import React, { useEffect, useState } from "react";
import RecipeForm from "./RecipeForm";
import "antd/dist/antd.min.css";
import "./NewRecipe.css";
import { FetchRecipe, PutRecipe } from "./fetchRecipe";
import { Recipe, NumberRecipe } from "./recipe";
import { useParams } from "react-router-dom";
import { emptyNumberRecipe } from "./emptyRecipe";
import dayjs from "dayjs";
import { AddRecipeForm } from "./addRecipeForm";
import type { NotificationPlacement } from "antd/es/notification";
import { Form, notification } from "antd";

export default function EditRecipe() {
  const [currentRecipe, setCurrentRecipe] =
    useState<NumberRecipe>(emptyNumberRecipe);
  const [recipeIsLoading, setRecipeIsLoading] = useState(true);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedRecipeNames, setRecommendedRecipeNames] = useState<
    string[]
  >([]);

  const id = useParams().recipeId;
  const [form] = Form.useForm<AddRecipeForm>();

  const getAllRecipes = async () => {
    const data: Recipe[] = await FetchRecipe();
    setAllRecipes(data);
    setIsLoading(false);
    getRecipe(data);
  };

  const getRecipe = async (allData: Recipe[]) => {
    const data: Recipe = await FetchRecipe(id);
    const dataCopy: any = { ...data };
    dataCopy.link = [];
    for (let index = 0; index < data.ingredients.length; index++) {
      if (data.ingredients[index].starred === true) {
        dataCopy.ingredients[index].starred = 1 as number;
      } else {
        dataCopy.ingredients[index].starred = 0 as number;
      }
    }
    for (let recommendation of data.link) {
      let recipe = allData.find(
        (recipe) => recipe.id === parseInt(recommendation)
      );
      if (recipe) {
        dataCopy.link.push(recipe.name);
      }
    }
    const dataFinal: NumberRecipe = dataCopy;
    setCurrentRecipe(dataFinal);
    setRecipeIsLoading(false);
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const submitRecipe = async (values: AddRecipeForm) => {
    let image = "";
    if (values.thumbnail !== undefined) {
      image = values.thumbnail;
    }

    const recommendArray: string[] = [];
    for (let recipe of allRecipes) {
      if (recommendedRecipeNames.includes(recipe.name)) {
        recommendArray.push(recipe.id.toString());
      }
    }

    const ingredientArray: { starred: boolean; ingredient: string }[] =
      values.ingredients.map((ingredient) => ({
        starred: ingredient.starred === 1,
        ingredient: ingredient.ingredient,
      }));

    const stepArray: { step: number; directions: string; image: string }[] =
      values.steps.map((step, stepIndex) => ({
        step: stepIndex + 1,
        image: step.image,
        directions: step.directions,
      }));

    const date = dayjs().format("MM/DD/YYYY");

    let response = new Response();
    if (id) {
      const newRecipe: Recipe = {
        id: currentRecipe.id,
        name: values.name,
        thumbnail: { image: image },
        description: values.description,
        link: recommendArray,
        metadata: {
          lastViewed: date,
          created: currentRecipe.metadata.created,
          timeToCook: values.timetocook,
        },
        ingredients: ingredientArray,
        steps: stepArray,
      };

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      };
      response = await PutRecipe(requestOptions, currentRecipe.id);
      const placement: NotificationPlacement = "top";
      if (response.status === 200) {
        notification.open({
          message: "Recipe Successfully Edited!",
          description: values.name + " was edited",
          placement,
        });
      } else {
        notification.open({
          message: "Recipe Not Added...",
          description: "Response code: " + response.status,
          placement,
        });
      }
    }
  };

  if (isLoading || recipeIsLoading) {
    return <p>Data is loading...</p>;
  }

  const newPage = false;
  return (
    <div className="new">
      <div className="new__body">
        <h1 className="new-text-color">Edit a Recipe</h1>
        <div className="new__body__parameters">
          {RecipeForm(
            submitRecipe,
            currentRecipe,
            allRecipes,
            recommendedRecipeNames,
            setRecommendedRecipeNames,
            form,
            newPage
          )}
        </div>
      </div>
    </div>
  );
}
