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

  const id = useParams().recipeId;
  const getRecipe = async () => {
    const data = await FetchRecipe(id);
    setCookingRecipe(data);
    setLoading(false);
  };

  useEffect(() => {
    getRecipe();
  }, []);

  const renderHeader = () => {
    return (
      <div className="Cooking-StepBar">
        <div className="Cooking-Previous">
          <Button
            size="large"
            shape="round"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
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
            disabled={page === cookingRecipe.steps.length - 1}
          >
            Next {">"}
          </Button>
        </div>
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
        {cookingRecipe.steps[page].image && (
          <div className="Cooking-StepImage">
            <Image
              width={300}
              height={200}
              src={cookingRecipe.steps[page].image}
              style={{ objectFit: "cover" }}
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
