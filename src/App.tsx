import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Recipe } from "./recipe";
import { Button, Collapse, Image } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function App() {
  const [page, setPage] = useState<Recipe[]>();

  const getAllRecipes = async () => {
    const response = await fetch("http://localhost:3001/recipe");
    const data: Recipe[] = await response.json();
    if (data !== undefined) {
      data.map((recipe) => {
        if (recipe.thumbnail.image === "") {
          recipe.thumbnail.show = false;
        }
      });
      setPage(data);
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
    if (page !== undefined) {
      const tempPage: Recipe[] = [...page];
      const recipe = { ...tempPage[index] };
      if (image !== "") {
        if (show === true) {
          recipe.thumbnail.show = false;
        } else {
          recipe.thumbnail.show = true;
        }
        tempPage[index] = recipe;
        setPage(tempPage);
      } else {
        recipe.thumbnail.show = false;
        tempPage[index] = recipe;
        setPage(tempPage);
      }
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
    if (page !== undefined) {
      var recommendation = page.find((item) => item.id === parseInt(id));
      if (recommendation !== undefined) {
        return recommendation.thumbnail.image;
      }
    }
  };

  const getRecommendationName = (id: string) => {
    if (page !== undefined) {
      var recommendation = page.find((item) => item.id === parseInt(id));
      if (recommendation !== undefined) {
        return recommendation.name;
      }
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
        {page?.map((item, index) => (
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
                  <div className="RecommendationTitle">Recommendations</div>
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
