import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "./recipe";
import { Image, Button } from "antd";
import "antd/dist/antd.min.css";
import "./Cooking.css";

export default function CookingPages() {
  const emptyRecipe: Recipe = {
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

  const [cookingRecipe, setCookingRecipe] = useState<Recipe>(emptyRecipe);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const id = useParams().recipeId;
  if (!id) {
    throw new Error("id is undefined");
  }

  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  if (!baseUrl || baseUrl === "undefined") {
    throw new Error("The URL environment variable is undefined/missing");
  }
  const cookingUrl = baseUrl + "/recipe/" + id;

  const getRecipe = async () => {
    const response = await fetch(cookingUrl);
    const data: Recipe = await response.json();
    if (!data) {
      throw new Error(
        "The fetch call did not return any data matching the Recipe Type"
      );
    }
    setCookingRecipe(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getRecipe();
  }, []);

  const renderHeader = () => {
    if (page === 0) {
      return (
        <div className="Cooking-StepBar">
          <div className="Cooking-Previous"></div>
          <div className="Cooking-CurrentStep">
            <p>Step: {cookingRecipe.steps[page].step}</p>
          </div>
          <div className="Cooking-Next">
            <Button
              size="large"
              shape="round"
              onClick={() => setPage(page + 1)}
            >
              Next {">"}
            </Button>
          </div>
        </div>
      );
    } else if (page === cookingRecipe.steps.length - 1) {
      return (
        <div className="Cooking-StepBar">
          <div className="Cooking-Previous">
            <Button
              size="large"
              shape="round"
              onClick={() => setPage(page - 1)}
            >
              {"<"} Prev
            </Button>
          </div>
          <div className="Cooking-CurrentStep">
            <p>Step: {cookingRecipe.steps[page].step}</p>
          </div>
          <div className="Cooking-Next"></div>
        </div>
      );
    } else {
      return (
        <div className="Cooking-StepBar">
          <div className="Cooking-Previous">
            <Button
              size="large"
              shape="round"
              onClick={() => setPage(page - 1)}
            >
              {"<"} Prev
            </Button>
          </div>
          <div className="Cooking-CurrentStep">
            <p>Step: {cookingRecipe.steps[page].step}</p>
          </div>
          <div className="Cooking-Next">
            <Button
              size="large"
              shape="round"
              onClick={() => setPage(page + 1)}
            >
              Next {">"}
            </Button>
          </div>
        </div>
      );
    }
  };

  const renderImage = () => {
    if (cookingRecipe.steps[page].image !== "") {
      return (
        <div className="Cooking-StepImage">
          <Image
            width={300}
            height={200}
            src={cookingRecipe.steps[page].image}
          />
        </div>
      );
    } else {
      return;
    }
  };

  if (loading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className="Cooking">
      <div className="Cooking-Title">{cookingRecipe.name}</div>
      <div className="Cooking-Header">{renderHeader()}</div>
      <div className="Cooking-Body">
        {renderImage()}
        <div className="Cooking-Directions">
          <p>{cookingRecipe.steps[page].directions}</p>
        </div>
      </div>
    </div>
  );
}
