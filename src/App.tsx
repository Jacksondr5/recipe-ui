import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import { Recipe } from "./recipe";
import { Button, Collapse, Image } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function App() {
  type UiRecipe = Recipe & {
    thumbnail: {
      show: boolean;
    };
  };

  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  if (!baseUrl || baseUrl === "undefined") {
    throw new Error("The URL environment variable is undefined/missing");
  }

  const url = baseUrl + "/recipe";
  const [allRecipes, setAllRecipes] = useState<UiRecipe[]>([]);

  const getAllRecipes = async () => {
    const response = await fetch(url);
    const data: UiRecipe[] = await response.json();
    if (!data) {
      throw new Error(
        "The fetch call did not return any data matching the Recipe Type"
      );
    }
    data.map((recipe) => {
      if (recipe.thumbnail.image === "") {
        recipe.thumbnail.show = false;
      }
      recipe.thumbnail.show = true;
    });
    setAllRecipes(data);
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const onChange = (index: number) => {
    const tempPage: UiRecipe[] = [...allRecipes];
    const recipe = { ...tempPage[index] };
    if (recipe.thumbnail.image !== "") {
      if (recipe.thumbnail.show === true) {
        recipe.thumbnail.show = false;
      } else {
        recipe.thumbnail.show = true;
      }
      tempPage[index] = recipe;
      setAllRecipes(tempPage);
    } else {
      recipe.thumbnail.show = false;
      tempPage[index] = recipe;
      setAllRecipes(tempPage);
    }
  };

  const { Panel } = Collapse;

  const genExtra = () => (
    <div className="App-Extra">
      <EditOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      />
    </div>
  );

  const getRecommendationPic = (id: string) => {
    var recommendation = allRecipes.find(
      (recipe) => recipe.id === parseInt(id)
    );
    if (recommendation !== undefined) {
      return recommendation.thumbnail.image;
    }
  };

  const getRecommendationName = (id: string) => {
    var recommendation = allRecipes.find(
      (recipe) => recipe.id === parseInt(id)
    );
    if (recommendation !== undefined) {
      return recommendation.name;
    }
  };

  return (
    <div className="App">
      <div className="App-Ipad">
        {allRecipes.map((recipe, index) => (
          <div className="App-Recipes" key={index}>
            <>
              {recipe.thumbnail.show && (
                <Image width={150} src={recipe.thumbnail.image} />
              )}
            </>
            <div className="App-RecipeBox">
              <Collapse
                onChange={() => onChange(index)}
                expandIconPosition="end"
              >
                <Panel
                  header={
                    <div>
                      <b style={{ fontSize: "20px", padding: "15px" }}>
                        {recipe.name}
                      </b>
                    </div>
                  }
                  key={index}
                  extra={genExtra()}
                >
                  <div className="App-FirstSection">
                    <div className="App-DescriptionBox">
                      {recipe.description}
                    </div>
                    <div className="App-MetadataBox">
                      <p>Created: {recipe.metadata.created}</p>
                      <p>Last Viewed: {recipe.metadata.lastViewed}</p>
                      <p>Time to Cook: {recipe.metadata.timeToCook}</p>
                    </div>
                  </div>
                  <div className="App-IngredientBox">
                    <h2>Key Ingredients</h2>
                    {recipe.ingredients.map((ingredient, ingredIndex) => (
                      <div key={ingredIndex}>
                        {ingredient.starred && ingredient.ingredient}
                      </div>
                    ))}
                  </div>
                  <div className="App-RecommendationTitle">
                    <h2>Recommendations</h2>
                  </div>
                  <div className="App-RecommendationsBox">
                    {recipe.link.map((linkedRecipeId, recIndex) => (
                      <div className="App-RecommendationCard" key={recIndex}>
                        <div>
                          <Image
                            width={100}
                            src={getRecommendationPic(linkedRecipeId)}
                            preview={false}
                          />
                        </div>
                        <p>{getRecommendationName(linkedRecipeId)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="App-ButtonBox">
                    <div className="App-ReadingButton">
                      <Button>Reading Mode</Button>
                    </div>
                    <div className="App-CookingButton">
                      <Button>Cooking Mode</Button>
                    </div>
                  </div>
                  <div className="App-DeleteButton">
                    <Button danger icon={<DeleteOutlined />}></Button>
                  </div>
                </Panel>
              </Collapse>
            </div>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
