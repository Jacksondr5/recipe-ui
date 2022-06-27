import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Recipe } from "./recipe";
import { Collapse, Select, Image } from "antd";
import { EditOutlined } from "@ant-design/icons";

function App() {
  const [page, setPage] = useState<Recipe[]>();

  const getAllRecipes = async () => {
    const response = await fetch("http://localhost:3001/recipe");
    const data: Recipe[] = await response.json();
    console.log(data);
    setPage(data);
  };

  useEffect(() => {
    getAllRecipes();
    console.log(page);
  }, []);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const { Panel } = Collapse;
  const { Option } = Select;

  const genExtra = (thumbnail: string) => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Image width={150} src={thumbnail} />
      <EditOutlined
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }}
      />
    </div>
  );

  const showPicture = (thumbnail: string) => {
    if (thumbnail !== "") {
      return (
        <>
          <Image width={150} src={thumbnail} />
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
            <>{showPicture(item.thumbnail)}</>
            <div className="RecipeBox">
              <Collapse onChange={onChange} expandIconPosition="end">
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
