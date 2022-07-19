import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./NewRecipe.css";
import { Recipe } from "./recipe";
import {
  Button,
  Rate,
  Form,
  Input,
  Modal,
  Checkbox,
  Image,
  Result,
  notification,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { NotificationPlacement } from "antd/lib/notification";

export default function NewRecipe() {
  const { TextArea, Search } = Input;
  const [visible, setVisible] = useState(false);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [someRecipes, setSomeRecipes] = useState<Recipe[]>([]);
  const [loadedRecipes, setLoadedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  if (!baseUrl || baseUrl === "undefined") {
    throw new Error("The URL environment variable is undefined/missing");
  }

  const url = baseUrl + "/recipe";

  const getAllRecipes = async () => {
    const response = await fetch(url);
    const data: Recipe[] = await response.json();
    if (!data) {
      throw new Error(
        "The fetch call did not return any data matching the Recipe Type"
      );
    }
    setAllRecipes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const onCreate = (values: any) => {
    const newLoadedRecipes = [...loadedRecipes];
    Object.entries(values).find(([key, value]) => {
      if (value === true) {
        var recipe = allRecipes.find((recipe) => recipe.id === parseInt(key));
        if (!recipe) {
          throw new Error("Undefined Recipe from Modal");
        }
        if (!newLoadedRecipes.includes(recipe)) {
          newLoadedRecipes.push(recipe);
        }
      }
    });
    setLoadedRecipes(newLoadedRecipes);
    setVisible(false);
  };

  const onSearch = async (value: string) => {
    const regexp = new RegExp(value, "i");

    setSomeRecipes(allRecipes.filter((recipe) => regexp.test(recipe.name)));
    setVisible(true);
  };

  const CollectionCreateForm = () => {
    return (
      <Modal
        visible={visible}
        title="Recipe Search Results:"
        okText="Add Recommendation"
        cancelText="Cancel"
        onCancel={() => setVisible(false)}
        onOk={() => {
          modalForm
            .validateFields()
            .then((values) => {
              modalForm.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form name="selection" form={modalForm}>
          {someRecipes.map((recipe, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                backgroundColor: "lightgray",
                objectFit: "cover",
                marginBottom: "15px",
                alignItems: "center",
                borderRadius: "10px",
              }}
            >
              <Form.Item
                name={[recipe.id]}
                valuePropName="checked"
                initialValue={false}
                style={{
                  margin: "0px",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
              >
                <Checkbox
                  style={{
                    paddingLeft: "10px",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  {recipe.thumbnail.image && (
                    <Image
                      width={50}
                      height={50}
                      src={recipe.thumbnail.image}
                    />
                  )}
                  <span style={{ marginLeft: "10px" }}>{recipe.name}</span>
                </Checkbox>
              </Form.Item>
            </div>
          ))}
        </Form>
      </Modal>
    );
  };

  const deleteRecommendation = (recIndex: number) => {
    const newLoadedRecipes: Recipe[] = [...loadedRecipes];
    newLoadedRecipes.splice(recIndex, 1);
    setLoadedRecipes(newLoadedRecipes);
  };

  const submitRecipe = async (values: any) => {
    var image = "";
    if (values.thumbnail !== undefined) {
      image = values.thumbnail;
    }

    const recommendArray: string[] = [];
    if (loadedRecipes.length > 0) {
      loadedRecipes.map((recipe, index) =>
        recommendArray.push(recipe.id.toString())
      );
    } else {
      recommendArray.push("");
    }

    const ingredientArray: { starred: boolean; ingredient: string }[] = [];
    for (const [key] of Object.entries(values.ingredients)) {
      if (values.ingredients[key].starred === 1) {
        ingredientArray.push({
          starred: true,
          ingredient: values.ingredients[key].ingredient,
        });
      } else {
        ingredientArray.push({
          starred: false,
          ingredient: values.ingredients[key].ingredient,
        });
      }
    }

    const stepArray: { step: number; directions: string; image: string }[] = [];
    for (const [key] of Object.entries(values.steps)) {
      if (values.steps[key].image) {
        stepArray.push({
          step: parseInt(key) + 1,
          image: values.steps[key].image,
          directions: values.steps[key].directions,
        });
      } else {
        stepArray.push({
          step: parseInt(key) + 1,
          image: "",
          directions: values.steps[key].directions,
        });
      }
    }

    const current = new Date();
    const date = `${
      current.getMonth() + 1
    }/${current.getDate()}/${current.getFullYear()}`;

    const newRecipe: Recipe = {
      id: allRecipes[allRecipes.length - 1].id + 1,
      name: values.name,
      thumbnail: { image: image },
      description: values.description,
      link: recommendArray,
      metadata: {
        lastViewed: date,
        created: date,
        timeToCook: values.timetocook,
      },
      ingredients: ingredientArray,
      steps: stepArray,
    };

    // console.log(newRecipe);
    // console.log(allRecipes[3]);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    };
    const response = await fetch(url, requestOptions);

    // const response = { status: 200 };

    const placement: NotificationPlacement = "top";
    if (response.status === 201) {
      notification.open({
        message: "Recipe Successfully Added!",
        description: values.name + " was added",
        placement,
      });
      form.resetFields();
    } else {
      notification.open({
        message: "Recipe Not Added...",
        description: "Response code: " + response.status,
        placement,
      });
    }
  };

  if (isLoading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className="New">
      <div className="New-Body">
        <h1 style={{ color: "rgb(200, 200, 200)" }}>Add a Recipe</h1>
        <div className="New-Parameters">
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            onFinish={submitRecipe}
          >
            <Form.Item
              label={<span className="New-TextColor">Recipe Name</span>}
              name="name"
              rules={[{ required: true, message: "Recipe name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<span className="New-TextColor">Thumbnail Source</span>}
              name="thumbnail"
              initialValue=""
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              label={<span className="New-TextColor">Description</span>}
              name="description"
              rules={[
                { required: true, message: "Description name is required" },
              ]}
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              label={<span className="New-TextColor">Time to Cook</span>}
              name="timetocook"
              rules={[{ required: true, message: "Time to cook is required" }]}
            >
              <TextArea autoSize />
            </Form.Item>

            <br />
            <Form.List
              name="ingredients"
              initialValue={[{ starred: 0, ingredient: undefined }]}
            >
              {(ingredients, { add, remove }) => (
                <div>
                  <Form.Item>
                    <div
                      style={{
                        display: "inline-flex",
                        justifyContent: "space-between",
                        width: "100%",
                        color: "rgb(200, 200, 200)",
                      }}
                    >
                      <span>Ingredients</span>
                      <Button onClick={() => add()}>
                        <PlusOutlined /> Add an Ingredient
                      </Button>
                    </div>
                  </Form.Item>

                  {ingredients.map((ingredient, ingredientIndex) => (
                    <div key={ingredient.key}>
                      <Form.Item
                        name={[ingredientIndex, "ingredient"]}
                        rules={[
                          {
                            required: true,
                            message: "Ingredients are required",
                          },
                        ]}
                      >
                        <Input
                          addonBefore={
                            <Form.Item
                              name={[ingredientIndex, "starred"]}
                              valuePropName="checked"
                              initialValue={0}
                              style={{
                                display: "flex",
                                padding: "0px",
                                margin: "0px",
                              }}
                            >
                              <Rate count={1} />
                            </Form.Item>
                          }
                          addonAfter={
                            ingredients.length < 2 ? null : (
                              <DeleteOutlined
                                type="danger"
                                onClick={() => remove(ingredient.name)}
                                style={{ color: "red" }}
                              />
                            )
                          }
                        />
                      </Form.Item>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <br />
            <Form.List
              name="steps"
              initialValue={[{ directions: "", image: "" }]}
            >
              {(steps, { add, remove }) => (
                <div>
                  <Form.Item>
                    <div
                      style={{
                        display: "inline-flex",
                        justifyContent: "space-between",
                        width: "100%",
                        color: "rgb(200, 200, 200)",
                      }}
                    >
                      <span>Steps</span>
                      <Button onClick={() => add()}>
                        <PlusOutlined /> Add a Step
                      </Button>
                    </div>
                  </Form.Item>

                  {steps.map((step, stepIndex) => (
                    <div key={stepIndex}>
                      <Form.Item
                        name={[stepIndex, "directions"]}
                        rules={[
                          {
                            required: true,
                            message: "Steps are required",
                          },
                        ]}
                      >
                        <Input
                          addonBefore={<span>Step: {stepIndex + 1}</span>}
                          addonAfter={
                            steps.length < 2 ? null : (
                              <DeleteOutlined
                                type="danger"
                                onClick={() => remove(step.name)}
                                style={{ color: "red" }}
                              />
                            )
                          }
                        ></Input>
                      </Form.Item>
                      <Form.Item name={[stepIndex, "image"]}>
                        <Input addonBefore={"Image URL:"} />
                      </Form.Item>
                      <br />
                    </div>
                  ))}
                </div>
              )}
            </Form.List>

            <Form.Item>
              <div
                style={{
                  display: "inline-flex",
                  justifyContent: "space-between",
                  width: "100%",
                  color: "rgb(200, 200, 200)",
                }}
              >
                <span>Recommendations</span>
                <Search
                  placeholder="recipe name"
                  onSearch={onSearch}
                  style={{ width: "150px" }}
                />
                <CollectionCreateForm />
              </div>
            </Form.Item>

            {loadedRecipes.map((recommendation, recIndex) => (
              <div key={recIndex}>
                <span
                  style={{
                    display: "flex",
                    backgroundColor: "lightgray",
                    objectFit: "cover",
                    marginBottom: "10px",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ width: "100%", display: "inline-flex" }}>
                    {recommendation.thumbnail.image && (
                      <Image
                        width={50}
                        height={50}
                        src={recommendation.thumbnail.image}
                      />
                    )}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "10px",
                      }}
                    >
                      {recommendation.name}
                    </span>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "15px",
                      color: "red",
                    }}
                  >
                    <DeleteOutlined
                      onClick={() => deleteRecommendation(recIndex)}
                    />
                  </span>
                </span>
              </div>
            ))}

            <div className="New-Submit">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
