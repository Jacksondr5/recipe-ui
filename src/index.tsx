import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReadingPages from "./ReadingPages";
import CookingPages from "./CookingPages";
import NewRecipe from "./NewRecipePage";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/recipe" />} />
        <Route path="/recipe" element={<App />} />
        <Route path="reading/:recipeId" element={<ReadingPages />}></Route>
        <Route path="cooking/:recipeId" element={<CookingPages />}></Route>
        <Route path="newrecipe" element={<NewRecipe />}></Route>
        <Route path="editrecipe/:recipeId" element={<NewRecipe />}></Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
