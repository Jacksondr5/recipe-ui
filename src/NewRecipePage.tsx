import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./NewRecipe.css";
import { Recipe, NumberRecipe } from "./recipe";
import { FetchRecipe, PostRecipe } from "./fetchRecipe";
import { AddRecipeForm } from "./addRecipeForm";
import dayjs from "dayjs";
import { Form, notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification";
import { emptyNumberRecipe } from "./emptyRecipe";
import RecipeForm from "./RecipeForm";

export default function NewRecipe() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipeNames, setRecommendedRecipeNames] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm<AddRecipeForm>();

  const currentRecipe: NumberRecipe = emptyNumberRecipe;

  const getAllRecipes = async () => {
    const data: Recipe[] = await FetchRecipe();
    setAllRecipes(data);
    setIsLoading(false);
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

    type RecipePreview = Omit<Recipe, "id">;

    let response = new Response();
    const newRecipe: RecipePreview = {
      name: values.name,
      thumbnail: { image: image },
      description: values.description,
      link: recommendArray,
      metadata: {
        lastViewed: date,
        created: date,
        timeToCook: values.timetocook,
      },
      ingredients: ingredientArray,
      steps: stepArray,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    };
    response = await PostRecipe(requestOptions);

    const placement: NotificationPlacement = "top";
    if (response.status === 201) {
      notification.open({
        message: "Recipe Successfully Added!",
        description: values.name + " was added",
        placement,
      });
      form.resetFields();
    } else {
      notification.open({
        message: "Recipe Not Added...",
        description: "Response code: " + response.status,
        placement,
      });
    }
  };

  const newPage = true;

  if (isLoading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className="new">
      <div className="new__body">
        <h1 className="new-text-color">Add a Recipe</h1>
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
