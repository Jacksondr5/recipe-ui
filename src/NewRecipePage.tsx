import React, { useEffect, useState } from "react";
import "antd/dist/antd.min.css";
import "./NewRecipe.css";
import { Recipe } from "./recipe";
import { Button, Form, Input } from "antd";

export default function NewRecipe() {
  const { TextArea } = Input;
  const submitRecipe = (values: any) => {
    console.log(values);
  };

  return (
    <div className="New">
      <div className="New-Body">
        <h1 style={{ color: "rgb(200, 200, 200)" }}>Add a Recipe</h1>
        <div className="New-Parameters">
          <Form labelAlign="left" layout="vertical" onFinish={submitRecipe}>
            <Form.Item
              label={
                <span style={{ color: "rgb(200, 200, 200)" }}>Recipe Name</span>
              }
              name="name"
            >
              <Input style={{ backgroundColor: "rgb(200, 200, 200)" }} />
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: "rgb(200, 200, 200)" }}>
                  Thumbnail Source
                </span>
              }
              name="thumbnail"
            >
              <TextArea
                autoSize
                style={{ backgroundColor: "rgb(200, 200, 200)" }}
              />
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: "rgb(200, 200, 200)" }}>Description</span>
              }
              name="description"
            >
              <TextArea
                autoSize
                style={{ backgroundColor: "rgb(200, 200, 200)" }}
              />
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: "rgb(200, 200, 200)" }}>
                  Time to Cook
                </span>
              }
              name="cook"
            >
              <TextArea
                autoSize
                style={{ backgroundColor: "rgb(200, 200, 200)" }}
              />
            </Form.Item>

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
