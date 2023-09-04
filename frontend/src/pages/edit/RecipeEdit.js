import React, { useState, useEffect } from "react";
import RequireAuth from "../../utils/RequireAuth";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { update_Recipe } from "./RecipeEditActions";
import {
  flattenIntoString,
  parseIngredients,
  titleCase,
  titleCaseArr,
} from "../../utils";
import {
  Layout,
  Space,
  Button,
  Checkbox,
  Form,
  Input,
  TreeSelect,
  Rate,
  Tooltip,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const RecipeEdit = RequireAuth(({ displayMessage }) => {
  const recipe = useSelector((state) => state.recipe.recipe);
  const tagOptions = [
    ...useSelector((state) => state.catalog.searchOptions.tags),
  ];
  const navigate = useNavigate();

  const [url, setUrl] = useState(recipe.url);
  const [title, setTitle] = useState(titleCase(recipe.title));
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [tags, setTags] = useState(titleCaseArr(recipe.tags));
  const [allNotes, setAllNotes] = useState(recipe.notes);
  const [hasMade, setHasMade] = useState(recipe.has_made);
  const [rating, setRating] = useState(recipe.rating);
  const [ingredients, setIngredients] = useState(
    flattenIntoString(recipe.ingredients)
  );
  const [steps, setSteps] = useState(flattenIntoString(recipe.steps));

  const [form] = Form.useForm();
  const { Content } = Layout;
  const { TextArea } = Input;

  useEffect(() => {
    form.setFieldsValue({
      url: url,
      imgSrc: imgSrc,
      title: title,
      author: author,
      description: description,
      tags: tags,
      notes: allNotes,
      hasMade: hasMade,
      rating: rating,
      ingredients: ingredients,
      steps: steps,
    });
  }, [recipe]);

  const updateRecipe = () => {
    let notes = [...allNotes];

    if (notes.length > 0) {
      notes = notes.map((note) => {
        return note.trim();
      });
    } else {
      notes = [];
    }

    const updatedRecipe = {
      url: url,
      img_src: imgSrc,
      title: titleCase(title),
      author: titleCase(author),
      description: description,
      tags: titleCaseArr(tags),
      notes: allNotes,
      has_made: hasMade,
      rating: rating,
      ingredients: parseIngredients(ingredients),
      steps: parseIngredients(steps),
    };

    update_Recipe(recipe.id, updatedRecipe, navigate, displayMessage);
  };

  return Object.keys(recipe).length ? (
    <Content
      id="recipe-edit"
      className="w-full !pt-0 !pb-[45px] mt-[15px] flex flex-col items-center justify-center"
    >
      <Button
        className="btn-active mb-2.5"
        type="primary"
        block
        danger
        onClick={() => navigate(-1, { replace: true })}
      >
        <ArrowLeftOutlined /> Cancel
      </Button>
      {imgSrc ? (
        <img
          className="w-[225px] h-[225px] max-w-[225px] max-h-[255px] mt-0 mb-[15px] mx-auto object-cover rounded-lg"
          src={imgSrc}
        />
      ) : (
        <img
          className="w-[225px] h-[225px] max-w-[225px] max-h-[255px] mt-0 mb-[15px] mx-auto object-cover rounded-lg"
          src={"./static/graphics/default_image.jpg"}
        />
      )}
      <Form
        className="w-full"
        name="form"
        form={form}
        labelCol={{ flex: "100px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="Recipe URL"
          name="url"
          //   rules={[
          //     { required: true, message: "Please input the recipe's url!" },
          //   ]}
        >
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </Form.Item>

        <Form.Item
          className="mb-[15px]"
          // disabled={isUploading}
          label="Recipe Image"
        >
          <Tooltip
            color="#d32f2f"
            trigger={["focus"]}
            title='Right click on image, and click "copy image address". Paste address here.'
            placement="top"
          >
            <Input value={imgSrc} onChange={(e) => setImgSrc(e.target.value)} />
          </Tooltip>
        </Form.Item>

        <div className="flex items-baseline">
          <Form.Item name="hasMade" wrapperCol={{ span: 24 }}>
            <Checkbox
              className="mr-[15px]"
              checked={hasMade}
              onClick={() => setHasMade(!hasMade)}
            >
              Has Made?
            </Checkbox>
          </Form.Item>

          <Form.Item name="rating" wrapperCol={{ span: 24 }}>
            <Rate value={rating} onChange={(rating) => setRating(rating)} />
          </Form.Item>
        </div>

        <Form.Item
          label="Recipe Title"
          name="title"
          rules={[
            { required: true, message: "Please input the recipe's title!" },
          ]}
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>

        <Form.Item label="Recipe Author" name="author">
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Form.Item>

        <Form.Item label="Recipe Description" name="description">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 4 }}
            allowClear
          />
        </Form.Item>

        <Form.Item label="Recipe Tags" name="tags" wrapperCol={{ span: 12 }}>
          <TreeSelect
            treeData={tagOptions.sort(
              (a, b) => -b.title.localeCompare(a.title)
            )}
            onChange={(tags) => {
              setTags(tags);
            }}
            treeCheckable
            placeholder="Please select"
          />
        </Form.Item>

        <Form.Item label="Recipe Notes" name="notes">
          <Tooltip
            color="#d32f2f"
            trigger={["focus"]}
            title="Delimit separate notes with ; "
            placement="top"
          >
            <TextArea
              value={allNotes.join(";")}
              onChange={(e) => setAllNotes(e.target.value.split(";"))}
              autoSize
              allowClear
            />
          </Tooltip>
        </Form.Item>

        <Form.Item label="Recipe Ingredients" name="ingredients">
          <Tooltip
            color="#d32f2f"
            trigger={["focus"]}
            title='Please include a "--" before each heading. Each ingredient and heading needs to be on a new line.'
            placement="top"
          >
            <TextArea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
              allowClear
            />
          </Tooltip>
        </Form.Item>

        <Form.Item label="Recipe Steps" name="steps">
          <Tooltip trigger={["focus"]} placement="top">
            <TextArea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
              allowClear
            />
          </Tooltip>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className={title.length ? "btn-active" : "btn"}
            disabled={title.length ? false : true}
            onClick={updateRecipe}
            danger
            block
          >
            Update Recipe
          </Button>
        </Form.Item>
      </Form>
    </Content>
  ) : (
    <Space className="w-full mt-[50px] mb-[15px]" direction="vertical">
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </Space>
  );
});

export default RecipeEdit;
