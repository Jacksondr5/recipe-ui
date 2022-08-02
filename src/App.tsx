import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./App.css";
import { UiRecipe } from "./recipe";
import { FetchRecipe } from "./fetchRecipe";
import { Button, Collapse, Image, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { DeleteRecipe } from "./fetchRecipe";

function App() {
  const [allRecipes, setAllRecipes] = useState<UiRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllRecipes = async () => {
    const data: UiRecipe[] = await FetchRecipe();
    if (!data) {
      throw new Error(
        "The fetch call did not return any data matching the Recipe Type"
      );
    }
    data.map((recipe) => {
      if (recipe.thumbnail.image === "") {
        recipe.thumbnail.show = false;
      } else {
        recipe.thumbnail.show = true;
      }
    });
    setAllRecipes(data);
    setLoading(false);
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

  const genExtra = (recipeId: number) => (
    <div className="App-Extra">
      <Link to={`/editrecipe/${recipeId}`}>
        <EditOutlined
          onClick={(event) => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
          }}
          className="app-edit-button"
        />
      </Link>
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
    let recommendation = allRecipes.find(
      (recipe) => recipe.id === parseInt(id)
    );
    if (recommendation !== undefined) {
      return recommendation.name;
    }
  };

  const deleteRecipe = async (recipeId: number) => {
    await DeleteRecipe(recipeId);
    setLoading(true);
    getAllRecipes();
  };

  if (loading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className="App">
      <div className="App-NewRecipe">
        <Link to="/newrecipe">
          <Button>New Recipe</Button>
        </Link>
      </div>
      <div className="App-Ipad">
        {allRecipes.map((recipe, index) => (
          <div className="App-Recipes" key={index}>
            <>
              {recipe.thumbnail.show && (
                <Image
                  height={150}
                  width={150}
                  src={recipe.thumbnail.image}
                  style={{ objectFit: "cover" }}
                />
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
                  extra={genExtra(recipe.id)}
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
                      <Link to={`/reading/${recipe.id}`} key={index}>
                        <Button>Reading Mode</Button>
                      </Link>
                    </div>
                    <div className="App-CookingButton">
                      <Link to={`/cooking/${recipe.id}`} key={index}>
                        <Button>Cooking Mode</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="App-DeleteButton">
                    <Popconfirm
                      title="Delete this recipe?"
                      onConfirm={() => deleteRecipe(recipe.id)}
                      okText="Delete"
                      cancelText="Cancel"
                    >
                      <Button danger icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
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
