import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, FormInstance, Input, Rate, Select } from "antd";
import { SetStateAction } from "react";
import { AddRecipeForm } from "./addRecipeForm";
import { NumberRecipe, Recipe } from "./recipe";
import "antd/dist/antd.min.css";
import "./NewRecipe.css";

export default function RecipeForm(
  submitRecipe: (values: AddRecipeForm) => void,
  currentRecipe: NumberRecipe,
  allRecipes: Recipe[],
  recommendedRecipeNames: string[],
  setRecommendedRecipeNames: {
    (value: SetStateAction<string[]>): void;
    (arg0: string[]): void;
  },
  form: FormInstance<AddRecipeForm>,
  newPage: boolean
) {
  const { TextArea } = Input;
  const { Option } = Select;

  const onRecommendationsChange = (value: string[]) => {
    setRecommendedRecipeNames(value);
  };

  return (
    <Form
      form={form}
      labelAlign="left"
      layout="vertical"
      onFinish={submitRecipe}
      initialValues={{
        name: currentRecipe.name,
        thumbnail: currentRecipe.thumbnail.image,
        description: currentRecipe.description,
        timetocook: currentRecipe.metadata.timeToCook,
        ingredients: currentRecipe.ingredients,
        steps: currentRecipe.steps,
        recommendations: currentRecipe.link,
      }}
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
      >
        <TextArea autoSize />
      </Form.Item>
      <Form.Item
        label={<span className="new-text-color">Description</span>}
        name="description"
        rules={[{ required: true, message: "Description name is required" }]}
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
      <Form.List name="ingredients">
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
                        className="new__body__ingredient__star"
                      >
                        <Rate
                          count={1}
                          defaultValue={
                            !newPage
                              ? currentRecipe.ingredients[ingredientIndex]
                                  .starred
                              : 0
                          }
                        />
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
      <Form.List name="steps">
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
          onChange={onRecommendationsChange}
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
  );
}
