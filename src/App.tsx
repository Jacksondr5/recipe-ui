import React, { useEffect, useState } from 'react';
import "antd/dist/antd.css";
import './App.css';
import { Recipe } from './recipe';
import { Collapse, Select } from 'antd';
import { EditOutlined } from "@ant-design/icons";

function App() {
  const [page, setPage] = useState<Recipe[]>();

  const getAllRecipes = async () => {
    const response = await fetch('http://localhost:3001/recipe');
    const data: Recipe[] = await response.json();
    console.log(data);
    setPage(data);
  }

  useEffect(() => {
    getAllRecipes()
    console.log(page)
  }, []);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const { Panel } = Collapse;
  const { Option } = Select;

  const genExtra = () => (
    <EditOutlined
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
      }}
    />
  );

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "50px auto",
        }}
      >
        <h1>Recipe App</h1>
      </div>

      <div className="Ipad">
        {page?.map((item, index) =>
          <div className="Recipes" key = {index}> 
            <Collapse 
              onChange={onChange}
              expandIconPosition='end'
            >
              <Panel header={item.name} key={index} extra={genExtra()}>
                <div>{item.description}</div>
              </Panel>
            </Collapse>
            <br/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
