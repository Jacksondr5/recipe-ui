import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./NewRecipe.css";
import { Recipe } from "./recipe";
import { FetchRecipe, PostRecipe } from "./fetchRecipe";
import { AddRecipeForm } from "./addRecipeForm";
import dayjs from "dayjs";
import {
  Button,
  Rate,
  Form,
  Input,
  Checkbox,
  Image,
  notification,
  Select,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

export default function NewRecipe() {
  const { TextArea, Search } = Input;
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [recommendedRecipeNames, setRecommendedRecipeNames] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm<AddRecipeForm>();
  const { Option } = Select;

  const getAllRecipes = async () => {
    const data: Recipe[] = await FetchRecipe();
    setAllRecipes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  const submitRecipe = async (values: AddRecipeForm) => {
    var image = "";
    if (values.thumbnail !== undefined) {
      image = values.thumbnail;
    }

    const recommendArray: string[] = [];
    for (let recipe of allRecipes) {
      if (recommendedRecipeNames.includes(recipe.name)) {
        recommendArray.push(recipe.id.toString());
      }
    }

    const ingredientArray: { starred: boolean; ingredient: string }[] =
      values.ingredients.map((ingredient) => ({
        starred: ingredient.starred === 1,
        ingredient: ingredient.ingredient,
      }));

    const stepArray: { step: number; directions: string; image: string }[] =
      values.steps.map((step, stepIndex) => ({
        step: stepIndex + 1,
        image: step.image,
        directions: step.directions,
      }));

    const now = dayjs();
    const date = now.format("MM/DD/YYYY");

    type RecipePreview = Omit<Recipe, "id">;

    const newRecipe: RecipePreview = {
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
    console.log(newRecipe);
    console.log(allRecipes[3]);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecipe),
    };
    // const response = await PutRecipe(requestOptions);

    // const placement: NotificationPlacement = "top";
    // if (response.status === 201) {
    //   notification.open({
    //     message: "Recipe Successfully Added!",
    //     description: values.name + " was added",
    //     placement,
    //   });
    //   form.resetFields();
    // } else {
    //   notification.open({
    //     message: "Recipe Not Added...",
    //     description: "Response code: " + response.status,
    //     placement,
    //   });
    // }
  };

  const selectChange = (value: string[]) => {
    setRecommendedRecipeNames(value);
  };

  if (isLoading) {
    return <p>Data is loading...</p>;
  }

  return (
    <div className="new">
      <div className="new__body">
        <h1 className="new-text-color">Add a Recipe</h1>
        <div className="new__body__parameters">
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            onFinish={submitRecipe}
          >
            <Form.Item
              label={<span className="new-text-color">Recipe Name</span>}
              name="name"
              rules={[{ required: true, message: "Recipe name is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<span className="new-text-color">Thumbnail Source</span>}
              name="thumbnail"
              initialValue=""
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              label={<span className="new-text-color">Description</span>}
              name="description"
              rules={[
                { required: true, message: "Description name is required" },
              ]}
            >
              <TextArea autoSize />
            </Form.Item>
            <Form.Item
              label={<span className="new-text-color">Time to Cook</span>}
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
                    <div className="new__body__form__header">
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
                              className="new__body__ingredient__star"
                            >
                              <Rate count={1} />
                            </Form.Item>
                          }
                          addonAfter={
                            ingredients.length < 2 ? null : (
                              <DeleteOutlined
                                type="danger"
                                onClick={() => remove(ingredient.name)}
                                className="new__body__delete-button--red "
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
                    <div className="new__body__form__header">
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
                                className="new__body__delete-button--red"
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

            <Form.Item
              label={<span className="new-text-color">Recommendations</span>}
              name="recommendations"
            >
              <Select<string[]>
                mode="multiple"
                allowClear
                placeholder="Please Select"
                onChange={selectChange}
              >
                {allRecipes.map((recipe) => (
                  <Option key={recipe.name}>{recipe.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <div className="new-Submit">
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
