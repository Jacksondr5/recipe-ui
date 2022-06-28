import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Recipe } from "./recipe";
import { Collapse, Select, Image } from "antd";
import { EditOutlined } from "@ant-design/icons";

function App() {
  const [page, setPage] = useState<Recipe[]>();
  const [vision, setVision] = useState("block");

  const getAllRecipes = async () => {
    const response = await fetch("http://localhost:3001/recipe");
    const data: Recipe[] = await response.json();
    setPage(data);
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const onChange = (e: string | string[], id: number, thumbnail: string) => {
    if (vision == "block") {
      setVision("none");
      deletePicture(id);
    } else {
      setVision("block");
      showPicture(thumbnail, id);
    }
  };

  const { Panel } = Collapse;
  const { Option } = Select;

  const genExtra = (thumbnail: string) => (
    <EditOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  const deletePicture = (id: number) => {
    const element = document.getElementById(id.toString());
    element?.remove();
  };

  const showPicture = (thumbnail: string, id: number) => {
    if (thumbnail !== "") {
      return (
        <>
          <Image
            width={150}
            style={{ display: vision } as React.CSSProperties}
            src={thumbnail}
            preview={false}
            id={id.toString()}
          />
        </>
      );
    }
  };

  return (
    <div className="App">
      <h1>Recipe App</h1>

      <div className="Ipad">
        {page?.map((item, index) => (
          <div className="Recipes" key={index}>
            <>{showPicture(item.thumbnail, item.id)}</>
            <div className="RecipeBox">
              <Collapse
                onChange={(e) => onChange(e, item.id, item.thumbnail)}
                expandIconPosition="end"
              >
                <Panel
                  header={item.name}
                  key={index}
                  extra={genExtra(item.thumbnail)}
                >
                  <div>{item.description}</div>
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
