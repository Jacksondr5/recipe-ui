import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import { Recipe } from "./recipe";
import { Button, Collapse, Image } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function App() {
  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  if (!baseUrl) {
    throw new Error("The URL environment variable is undefined/missing");
  }
  const url = baseUrl + "/recipe";
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  const getAllRecipes = async () => {
    const response = await fetch(url);
    const data: Recipe[] = await response.json();
    if (!data) {
      throw new Error(
        "The fetch call did not return any data matching the Recipe Type"
      );
    }
    data.map((recipe) => {
      if (recipe.thumbnail.image === "") {
        recipe.thumbnail.show = false;
      }
    });
    setAllRecipes(data);
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const onChange = (
    e: string | string[],
    index: number,
    image: string,
    show: boolean
  ) => {
    const tempPage: Recipe[] = [...allRecipes];
    const recipe = { ...tempPage[index] };
    if (image !== "") {
      if (show === true) {
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
    <EditOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
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

  const displayIngredient = (ingredient: string, starred: boolean) => {
    if (starred === true) {
      return ingredient;
    }
  };

  return (
    <div className="App">
      <h1>Recipe App</h1>

      <div className="Ipad">
        {allRecipes.map((recipe, index) => (
          <div className="Recipes" key={index}>
            <>
              {recipe.thumbnail.show && (
                <Image width={150} src={recipe.thumbnail.image} />
              )}
            </>
            <div className="RecipeBox">
              <Collapse
                onChange={(e) =>
                  onChange(
                    e,
                    index,
                    recipe.thumbnail.image,
                    recipe.thumbnail.show
                  )
                }
                expandIconPosition="end"
              >
                <Panel
                  header={<b style={{ fontSize: "20px" }}>{recipe.name}</b>}
                  key={index}
                  extra={genExtra()}
                >
                  <div className="FirstSection">
                    <div className="DescriptionBox">{recipe.description}</div>
                    <div className="MetadataBox">
                      <p>Created: {recipe.metadata.created}</p>
                      <p>Last Viewed: {recipe.metadata.lastViewed}</p>
                      <p>Time to Cook: {recipe.metadata.timeToCook}</p>
                    </div>
                  </div>
                  <div className="IngredientBox">
                    <h2>Key Ingredients</h2>
                    {recipe.ingredients.map((ingredient, ingredIndex) => (
                      <div key={ingredIndex}>
                        {displayIngredient(
                          ingredient.ingredient,
                          ingredient.starred
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="RecommendationTitle">
                    <h2>Recommendations</h2>
                  </div>
                  <div className="RecommendationsBox">
                    {recipe.link.map((linkedRecipeId, recIndex) => (
                      <div className="RecommendationCard" key={recIndex}>
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
                  <div className="ButtonBox">
                    <div className="ReadingButton">
                      <Button>Reading Mode</Button>
                    </div>
                    <div className="CookingButton">
                      <Button>Cooking Mode</Button>
                    </div>
                  </div>
                  <div className="DeleteButton">
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
