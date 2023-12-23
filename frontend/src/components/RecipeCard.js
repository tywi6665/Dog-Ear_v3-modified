import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge } from "antd";
import { StarFilled } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const { Meta } = Card;

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const wrapInRibbon = () => {
    const cardBase = (
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
                : "/static/graphics/default_image.jpg"
            }
          />
        }
      >
        <Meta description={recipe.title} />
      </Card>
    );

    const numStars = new Array(recipe.rating).fill(
      <StarFilled className="text-xs" />
    );

    if (recipe.rating && recipe.has_made) {
      return (
        <Badge.Ribbon text="Cooked" color="#d32f2f">
          <Badge.Ribbon className="mt-7" text={<>{numStars}</>} color="#f0ba4b">
            {cardBase}
          </Badge.Ribbon>
        </Badge.Ribbon>
      );
    } else if (recipe.rating) {
      return (
        <Badge.Ribbon className="mt-7" text={<>{numStars}</>} color="#f0ba4b">
          {cardBase}
        </Badge.Ribbon>
      );
    } else if (recipe.has_made) {
      return (
        <Badge.Ribbon text="Cooked" color="#d32f2f">
          {cardBase}
        </Badge.Ribbon>
      );
    } else {
      return cardBase;
    }
  };

  return <>{wrapInRibbon()}</>;
};
export default RecipeCard;
