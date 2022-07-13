import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "./recipe";
import { Image, Button } from "antd";
import "antd/dist/antd.min.css";
import "./Cooking.css";
import { FetchRecipe } from "./fetchRecipe";
import { emptyRecipe } from "./emptyRecipe";

export default function CookingPages() {
  const [cookingRecipe, setCookingRecipe] = useState<Recipe>(emptyRecipe);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const cookingUrl = FetchRecipe();

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
    getRecipe();
  }, []);

  const renderPrevious = () => {
    if (page === 0) {
      return;
    } else {
      return (
        <Button size="large" shape="round" onClick={() => setPage(page - 1)}>
          {"<"} Prev
        </Button>
      );
    }
  };

  const renderNext = () => {
    if (page === cookingRecipe.steps.length - 1) {
      return;
    } else {
      return (
        <Button size="large" shape="round" onClick={() => setPage(page + 1)}>
          Next {">"}
        </Button>
      );
    }
  };

  const renderHeader = () => {
    return (
      <div className="Cooking-StepBar">
        <div className="Cooking-Previous">{renderPrevious()}</div>
        <div className="Cooking-CurrentStep">
          <p>Step: {cookingRecipe.steps[page].step}</p>
        </div>
        <div className="Cooking-Next">{renderNext()}</div>
      </div>
    );
  };

  if (loading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className="Cooking">
      <div className="Cooking-Title">{cookingRecipe.name}</div>
      <div className="Cooking-Header">{renderHeader()}</div>
      <div className="Cooking-Body">
        {/* {renderImage()} */}
        {cookingRecipe.steps[page].image && (
          <div className="Cooking-StepImage">
            <Image
              width={300}
              height={200}
              src={cookingRecipe.steps[page].image}
            />
          </div>
        )}
        <div className="Cooking-Directions">
          <p>{cookingRecipe.steps[page].directions}</p>
        </div>
      </div>
    </div>
  );
}
