import React, { useState, useEffect, useRef } from "react";
import RequireAuth from "../../utils/RequireAuth";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { update_Recipe } from "./RecipeEditActions";
import {
  flattenIntoString,
  stringify,
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
  Rate,
  Tooltip,
  Spin,
  Select,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const RecipeEdit = RequireAuth(({ displayMessage }) => {
  const recipe = useSelector((state) => state.recipe.recipe);
  const catalog = useSelector((state) => state.catalog);
  const searchOptions = useSelector((state) => state.catalog.searchOptions);
  const navigate = useNavigate();

  const [url, setUrl] = useState(recipe.url);
  const [title, setTitle] = useState(titleCase(recipe.title));
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [allTags, setAllTags] = useState([]);
  const [tags, setTags] = useState(titleCaseArr(recipe.tags));
  const [newTag, setNewTag] = useState("");
  const [allNotes, setAllNotes] = useState(recipe.notes);
  const [hasMade, setHasMade] = useState(recipe.has_made);
  const [rating, setRating] = useState(recipe.rating);
  const [ingredients, setIngredients] = useState(
    flattenIntoString(recipe.ingredients)
  );
  const [steps, setSteps] = useState(flattenIntoString(recipe.steps));
  const inputRef = useRef(null);
  const [form] = Form.useForm();
  // const newNotes = Form.useWatch("notes", { form });
  const { Content } = Layout;
  const { TextArea } = Input;

  useEffect(() => {
    if (Object.keys(catalog).length) {
      setAllTags(searchOptions.tags);
    }
  }, [catalog]);

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
    let newNotes = [...allNotes];

    if (newNotes.length > 0) {
      newNotes = newNotes.filter((note) => note.text.length > 0);
      newNotes.forEach((note) => {
        return note.text.trim();
      });
    } else {
      newNotes = [];
    }

    const updatedRecipe = {
      url: url,
      img_src: imgSrc,
      title: titleCase(title),
      author: titleCase(author),
      description: description,
      tags: titleCaseArr(tags.sort()),
      notes: newNotes,
      has_made: hasMade,
      rating: rating,
      ingredients: stringify(ingredients, "ingredients"),
      steps: stringify(steps, "steps"),
    };

    update_Recipe(recipe.id, updatedRecipe, navigate, displayMessage);
  };

  const removeNote = (i) => {
    let copy = JSON.parse(JSON.stringify([...allNotes]));
    copy[i].text = "";
    setAllNotes(copy);
  };

  const addNote = () => {
    let copy = JSON.parse(JSON.stringify([...allNotes]));
    copy.push({
      date: moment().format("MM/DD/YYYY"),
      text: "",
    });
    setAllNotes(copy);
  };

  const updateNote = (i, value) => {
    let copy = JSON.parse(JSON.stringify([...allNotes]));
    copy[i].text = value;
    setAllNotes(copy);
  };

  const addItem = (e) => {
    e.preventDefault();
    const newTagTrimmed = titleCase(newTag.trim());
    const isPresent = allTags.map((tag) => tag.value).indexOf(newTagTrimmed);
    if (newTagTrimmed.length && isPresent === -1) {
      const sorted = [
        ...allTags,
        {
          title: newTagTrimmed,
          key: newTagTrimmed,
          value: newTagTrimmed,
        },
      ].sort((a, b) => -b.title.localeCompare(a.title));
      setAllTags(sorted);
    } else if (!newTagTrimmed.length) {
      displayMessage("Please write a tag", "error");
    } else if (isPresent >= 0) {
      displayMessage(
        `The tag ${titleCase(newTagTrimmed)} is already exists`,
        "error"
      );
    }

    setNewTag("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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
          src={"/static/graphics/default_image.jpg"}
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

        {/* <Form.Item label="Recipe Tags" name="tags" wrapperCol={{ span: 12 }}>
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
        </Form.Item> */}
        <Form.Item label="Recipe Tags" name="tags" wrapperCol={{ span: 24 }}>
          <Select
            className="w-full"
            mode="multiple"
            allowClear
            placeholder="Add tags"
            onChange={(value) => setTags(value)}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Space
                  style={{
                    padding: "0 8px 4px",
                  }}
                >
                  <Input
                    placeholder="Add new tag"
                    ref={inputRef}
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                    Add tag
                  </Button>
                </Space>
              </>
            )}
            options={allTags.map((tag) => ({
              label: tag.title,
              value: tag.value,
            }))}
          />
        </Form.Item>

        {/* <Form.Item label="Recipe Notes" name="notes">
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
        </Form.Item> */}

        <Form.Item label="Recipe Notes">
          <Form.List name="notes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    className="flex justify-center items-center gap-2 mb-2.5"
                  >
                    {key + 1}.
                    <Form.Item
                      {...restField}
                      name={[name, "text"]}
                      className="w-full m-0"
                      onChange={(e) => updateNote(key, e.target.value)}
                    >
                      <Input.TextArea
                        className="rounded w-full"
                        placeholder="Add a new note"
                        allowClear
                        autoSize
                        initialValues={allNotes[key].text}
                      />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => [removeNote(name), remove(name)]}
                    />
                  </div>
                ))}
                <Form.Item className="mb-0">
                  <Button
                    onClick={() => [addNote(), add()]}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add New Note
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
