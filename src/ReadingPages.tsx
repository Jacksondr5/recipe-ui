import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Recipe } from "./recipe";
import { Image } from "antd";
import "antd/dist/antd.min.css";
import "./Reading.css";

export default function ReadingPage() {
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

  const [readingRecipe, setReadingRecipe] = useState<Recipe>(emptyRecipe);
  const [loading, setLoading] = useState(true);

  const id = useParams().recipeId;
  if (!id) {
    throw new Error("id is undefined");
  }

  const readingUrl = "http://localhost:3001/recipe/" + id;

  const getRecipe = async () => {
    const response = await fetch(readingUrl);
    const data: Recipe = await response.json();
    if (!data) {
      throw new Error(
        "The fetch call did not return any data matching the Recipe Type"
      );
    }
    setReadingRecipe(data);
    setLoading(false);
  };

  const showImage = (imageSrc: string) => {
    if (imageSrc !== "") {
      return (
        <div>
          <Image height={100} src={imageSrc} />
        </div>
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    getRecipe();
  }, []);

  if (loading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className="Reading">
      <div className="Reading-Title">{readingRecipe.name}</div>
      <div className="Reading-Body">
        <div className="Reading-Description">{readingRecipe.description}</div>
        <div className="Reading-FirstBox">
          <div className="Reading-Image">
            <Image
              height={250}
              width={250}
              src={readingRecipe.thumbnail.image}
              fallback={
                "https://cdn.dribbble.com/users/88213/screenshots/8560585/media/7263b7aaa8077a322b0f12a7cd7c7404.png?compress=1&resize=400x300"
              }
            />
          </div>
          <div className="Reading-Metadata">
            <p>Created: {readingRecipe.metadata.created}</p>
            <p>Last Viewed: {readingRecipe.metadata.lastViewed}</p>
            <p>Time to Cook: {readingRecipe.metadata.timeToCook}</p>
          </div>
        </div>

        {readingRecipe.steps.map((step, index) => (
          <div className="Reading-SecondBox">
            <div className="Reading-Steps" key={index}>
              <p>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Step {step.step}:
                </p>{" "}
                {step.directions}
              </p>
            </div>
            <div className="Reading-ImageStep">{showImage(step.image)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
