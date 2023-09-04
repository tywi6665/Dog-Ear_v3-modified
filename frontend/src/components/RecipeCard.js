import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge } from "antd";

const { Meta } = Card;

const RecipeCard = ({ recipe }) => {
  //   const [recipe, setRecipe] = useState(recipeInfo);

  //   useEffect(() => {
  //     setRecipe(recipeInfo);
  //   }, [recipeInfo]);

  const navigate = useNavigate();

  return (
    <>
      {recipe.has_made ? (
        <Badge.Ribbon text="Cooked" color="#d32f2f">
          <Card
            className="max-w-[300px] w-full"
            hoverable
            onClick={() => {
              navigate(`recipe/${recipe.id}`);
            }}
            size="small"
            cover={
              <img
                src={
                  recipe.img_src
                    ? recipe.img_src
                    : "./static/graphics/default_image.jpg"
                }
              />
            }
          >
            <Meta description={recipe.title} />
          </Card>
        </Badge.Ribbon>
      ) : (
        <Card
          className="max-w-[300px] w-full"
          hoverable
          onClick={() => {
            navigate(`recipe/${recipe.id}`);
          }}
          size="small"
          cover={
            <img
              src={
                recipe.img_src
                  ? recipe.img_src
                  : "./static/graphics/default_image.jpg"
              }
            />
          }
        >
          <Meta description={recipe.title} />
        </Card>
      )}
    </>
  );
};
export default RecipeCard;
