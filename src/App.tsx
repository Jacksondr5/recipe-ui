import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import { Recipe } from "./recipe";
import { Button, Collapse, Image } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function App() {
  const url = `${process.env.REACT_APP_URL}`;
  if (url === undefined) {
    throw new Error("invalid URL");
  }
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  const getAllRecipes = async () => {
    const response = await fetch(url);
    const data: Recipe[] = await response.json();
    if (data === undefined) {
      throw new Error("bad api call");
    } else {
      data.map((recipe) => {
        if (recipe.thumbnail.image === "") {
          recipe.thumbnail.show = false;
        }
      });
      setAllRecipes(data);
    }
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
    var recommendation = allRecipes.find((item) => item.id === parseInt(id));
    if (recommendation !== undefined) {
      return recommendation.thumbnail.image;
    }
  };

  const getRecommendationName = (id: string) => {
    var recommendation = allRecipes.find((item) => item.id === parseInt(id));
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
        {allRecipes.map((item, index) => (
          <div className="Recipes" key={index}>
            <>
              {item.thumbnail.show && (
                <Image width={150} src={item.thumbnail.image} preview={false} />
              )}
            </>
            <div className="RecipeBox">
              <Collapse
                onChange={(e) =>
                  onChange(e, index, item.thumbnail.image, item.thumbnail.show)
                }
                expandIconPosition="end"
              >
                <Panel header={item.name} key={index} extra={genExtra()}>
                  <div className="DescriptionBox">{item.description}</div>
                  <div className="FirstHalf">
                    <div className="IngredientBox">
                      <h2>Ingredients</h2>
                      {item.ingredients.map((ingred, ingredIndex) => (
                        <div key={ingredIndex}>
                          {displayIngredient(ingred.ingredient, ingred.starred)}
                        </div>
                      ))}
                    </div>
                    <div className="MetadataBox">
                      <p>Created: {item.metadata.created}</p>
                      <p>Last Viewed: {item.metadata.lastViewed}</p>
                      <p>Time to Cook: {item.metadata.timeToCook}</p>
                    </div>
                  </div>
                  <div className="RecommendationTitle">
                    <h2>Recommendations</h2>
                  </div>
                  <div className="RecommendationsBox">
                    {item.link.map((rec, recIndex) => (
                      <div className="RecommendationCard" key={recIndex}>
                        <div>
                          <Image width={100} src={getRecommendationPic(rec)} />
                        </div>
                        <p>{getRecommendationName(rec)}</p>
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
