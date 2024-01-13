import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { connect, disconnect, set_pastedUrl } from "./EntryActions";
import { get_Duplicates } from "../catalog/CatalogActions";
import {
  Modal,
  Space,
  Button,
  Checkbox,
  Form,
  Input,
  TreeSelect,
  Rate,
  Tooltip,
  List,
  Avatar,
  Typography,
  Spin,
  Select,
  Divider,
} from "antd";
import { stringify, titleCase, titleCaseArr } from "../../utils";
import SubmitButton from "../../components/SubmitButton";
// import {
//   directUploadStart,
//   directUploadDo,
//   directUploadFinish,
// } from "../../utils/upload";
import {
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const RecipeEntry = ({
  dispatch,
  displayMessage,
  isModalOpen,
  closeModal,
  handleAddRecipe,
  // handleImageUpload,
  // handleImageDelete,
  //   handleDelete,
  entryType,
  setEntryType,
  isSubmitted,
  setIsSubmitted,
  // isUploading,
  // setIsUploading,
  // imageName,
  // setImageName,
}) => {
  const pastedUrl = useSelector((state) => state.scrapedRecipe.url);
  const hadError = useSelector((state) => state.scrapedRecipe.hadError);
  const searchOptions = useSelector((state) => state.catalog.searchOptions);

  const duplicates = useSelector((state) => state.catalog.duplicates);
  const user = useSelector((state) => state.login.user.username);
  const scrapedRecipe = useSelector(
    (state) => state.scrapedRecipe.scrapedRecipe
  );

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [tagOptions, setTagOptions] = useState([...searchOptions.tags]);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [hasMade, setHasMade] = useState(false);
  const [rating, setRating] = useState(0);

  const inputRef = useRef(null);
  const [form] = Form.useForm();
  const { Paragraph, Text } = Typography;
  const { TextArea } = Input;

  useEffect(() => {
    connect(entryType, "", "", dispatch);
  }, []);

  useEffect(() => {
    if (entryType === "scrape" && Object.keys(scrapedRecipe).length) {
      setUrl(scrapedRecipe.url);
      setTitle(scrapedRecipe.title);
      setImgSrc(scrapedRecipe.img_src);
      setAuthor(scrapedRecipe.author);
      setDescription(scrapedRecipe.description);
      form.setFieldsValue({
        url: scrapedRecipe.url,
        title: scrapedRecipe.title,
        imgSrc: scrapedRecipe.imgSrc,
        author: scrapedRecipe.author,
        description: scrapedRecipe.description,
      });
    }
  }, [scrapedRecipe]);

  // const handleUpload = (e) => {
  //   const file = e;
  //   console.log(file);

  //   if (file) {
  //     directUploadStart({
  //       fileName: file.name,
  //       fileType: file.type,
  //     })
  //       .then((response) =>
  //         directUploadDo({ data: response.data, file })
  //           .then(() => directUploadFinish({ data: response.data }))
  //           .then((res) => {
  //             console.log(res, "File upload completed!");
  //           })
  //       )
  //       .catch((error) => {
  //         console.log(error);
  //         console.log("File upload failed!");
  //       });
  //   }
  // };

  const handleFormSubmit = () => {
    let newNotes = [...allNotes];

    if (newNotes.length > 0) {
      newNotes = newNotes.filter((note) => note.text.length > 0);
      newNotes.forEach((note) => {
        return note.text.trim();
      });
    } else {
      newNotes = [];
    }

    const recipe = {
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
    handleAddRecipe(recipe);
    disconnect(
      entryType,
      scrapedRecipe.unique_id,
      hadError,
      setEntryType,
      setIsSubmitted,
      dispatch
    );
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
    const isPresent = tagOptions.map((tag) => tag.value).indexOf(newTagTrimmed);
    if (newTagTrimmed.length && isPresent === -1) {
      const sorted = [
        ...tagOptions,
        {
          title: newTagTrimmed,
          key: newTagTrimmed,
          value: newTagTrimmed,
        },
      ].sort((a, b) => -b.title.localeCompare(a.title));
      setTagOptions(sorted);
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

  // useEffect(() => {
  //   if (Object.keys(imageName).length) {
  //     setImgSrc(imageName.image);
  //     form.setFieldsValue({
  //       imgSrc: imgSrc,
  //     });
  //   }
  // }, [imageName]);

  //   const createEntry = () => {
  //     let notes = [...allNotes];

  //     if (notes.length > 0) {
  //       notes = notes.map((note) => {
  //         return note.trim();
  //       });
  //     } else {
  //       notes = [];
  //     }

  //     handleCreate({
  //       unique_id: unique_id,
  //       title: title,
  //       url: url,
  //       author: author,
  //       img_src: imgSrc,
  //       description: description,
  //       has_made: hasMade,
  //       notes: notes,
  //       rating: rating,
  //       tags: tags,
  //       ingredients: ingredients,
  //       steps: steps,
  //     });
  //     setRecipe({});
  //     closeModal();
  //     if (type === "crawl") {
  //       handleDelete(recipe.unique_id, "crawledrecipe");
  //     }
  //     setUrl("");
  //     setIsSubmitted(false);
  //     setType("");
  //     // setIsUploading("");
  //     // setImageName({});
  //   };

  return (
    <Modal
      className="top-[20px]"
      title={
        entryType === "scrape"
          ? Object.keys(scrapedRecipe).length
            ? "Scraped Recipe Information"
            : "Retrieving Recipe"
          : "Blank Recipe Template"
      }
      closable={
        entryType === "blank" ||
        Object.keys(scrapedRecipe).length ||
        !isSubmitted
          ? true
          : false
      }
      destroyOnClose
      footer={null}
      open={isModalOpen}
      onCancel={() => [
        closeModal(),
        console.log("here"),
        get_Duplicates("", dispatch),
        disconnect(
          entryType,
          scrapedRecipe.unique_id,
          hadError,
          setEntryType,
          setIsSubmitted,
          dispatch
        ),
      ]}
    >
      {(pastedUrl || entryType === "blank") && isSubmitted ? (
        <div>
          {Object.keys(scrapedRecipe).length ? (
            <div>
              {hadError ? (
                <p>
                  <em>
                    The Recipe could not be scraped. Please input the recipe
                    information manually:
                  </em>
                </p>
              ) : null}
              <Space
                className="flex w-full"
                id="recipe-entry"
                direction="vertical"
                size="small"
              >
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
                  onFinish={handleFormSubmit}
                >
                  <Form.Item
                    label="Recipe URL"
                    name="url"
                    hasFeedback
                    rules={[
                      {
                        max: 1000,
                      },
                    ]}
                  >
                    <div>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={entryType === "blank" ? false : true}
                      />
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="Recipe Image"
                    hasFeedback
                    rules={[
                      {
                        max: 1000,
                      },
                    ]}
                  >
                    <Tooltip
                      color="#d32f2f"
                      trigger={["focus"]}
                      title='Right click on image, and click "copy image address". Paste address here.'
                      placement="top"
                    >
                      <Input
                        // disabled={isUploading}
                        value={imgSrc}
                        onChange={(e) => setImgSrc(e.target.value)}
                      />
                    </Tooltip>
                    {/* {entryType === "blank" ? (
                      <Space
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          marginTop: "10px",
                        }}
                      >
                        <p style={{ margin: 0 }}>or</p>
                        <Upload
                          // beforeUpload={(e) => console.log(e)}
                          onChange={(e) => {
                            handleUpload(e.file);
                          }}
                        >
                          <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                      </Space>
                    ) : null} */}
                  </Form.Item>
                  <Form.Item valuePropName="has_made" wrapperCol={{ span: 24 }}>
                    <Checkbox
                      className="mr-[15px]"
                      checked={hasMade}
                      onClick={() => setHasMade(!hasMade)}
                    >
                      Has Made?
                    </Checkbox>
                    <Rate
                      value={rating}
                      onChange={(rating) => setRating(rating)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Recipe Title"
                    name="title"
                    hasFeedback
                    rules={[
                      {
                        max: 1000,
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Recipe Author"
                    name="author"
                    hasFeedback
                    rules={[
                      {
                        max: 300,
                      },
                    ]}
                  >
                    <Input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Recipe Description"
                    name="description"
                    hasFeedback
                  >
                    <TextArea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoSize={{ minRows: 1, maxRows: 4 }}
                    />
                  </Form.Item>

                  {/* <Form.Item label="Recipe Tags" name="tags" hasFeedback>
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

                  <Form.Item
                    label="Recipe Tags"
                    name="tags"
                    wrapperCol={{ span: 24 }}
                  >
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
                            <Button
                              type="text"
                              icon={<PlusOutlined />}
                              onClick={addItem}
                            >
                              Add tag
                            </Button>
                          </Space>
                        </>
                      )}
                      options={tagOptions.map((tag) => ({
                        label: tag.title,
                        value: tag.value,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item label="Recipe Notes">
                    <Form.List name="notes">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              className="flex justify-center items-center gap-2 mb-2.5"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "text"]}
                                className="w-full m-0"
                                onChange={(e) =>
                                  updateNote(key, e.target.value)
                                }
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

                  <Form.Item
                    label="Recipe Ingredients"
                    name="ingredients"
                    hasFeedback
                  >
                    <Tooltip
                      color="#d32f2f"
                      trigger={["focus"]}
                      title='Please include a "--" before each heading. Each ingredient and heading needs to be on a new line.'
                      placement="top"
                    >
                      <TextArea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        autoSize={{ minRows: 3 }}
                      />
                    </Tooltip>
                  </Form.Item>
                  <Form.Item label="Recipe Steps" name="steps" hasFeedback>
                    <Tooltip
                      trigger={["focus"]}
                      title='Please include a "--" before each heading. Each ingredient and heading needs to be on a new line.'
                      placement="top"
                    >
                      <TextArea
                        value={steps}
                        onChange={(e) => setSteps(e.target.value)}
                        autoSize={{ minRows: 3 }}
                      />
                    </Tooltip>
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    <SubmitButton form={form} />
                    {/* <Button
                      type="primary"
                      htmlType="submit"
                      className={title.length ? "btn-active" : "btn"}
                      disabled={title.length ? false : true}
                      danger
                      block
                    >
                      Create Entry
                    </Button> */}
                  </Form.Item>
                </Form>
              </Space>
            </div>
          ) : (
            <>
              <div className="h-[100px] w-[100px] mt-[15px] mb-[50px] mx-auto text-center">
                <div className="dog-head z-[100]">
                  <img
                    className="h-full w-full"
                    src="/static/graphics/dog-head.png"
                  />
                </div>
                <img
                  className="h-full w-10/12 mt-[-62px] mb-2.5 mx-auto bg-contain bg-center bg-no-repeat"
                  src="/static/graphics/dog-body-md.png"
                />
              </div>
              <div className="text-center">
                <em>Fetching deliciousness </em>
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 24,
                      }}
                      spin
                    />
                  }
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <Form
            className="w-full"
            name="urlForm"
            labelCol={{ flex: "100px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            colon={false}
            autoComplete="off"
            onFinish={(e) => [
              e.preventDefault,
              setEntryType("scrape"),
              setIsSubmitted(true),
              connect("scrape", pastedUrl, user, dispatch),
              get_Duplicates("", dispatch),
            ]}
          >
            <Form.Item
              name="url"
              label="URL"
              rules={[
                { required: true },
                { type: "url", warningOnly: true },
                { type: "string", min: 6 },
              ]}
            >
              <Input
                placeholder="Paste Recipe URL Here"
                allowClear
                value={setEntryType !== "blank" ? pastedUrl : null}
                onChange={(e) => [
                  set_pastedUrl(e.target.value, dispatch),
                  get_Duplicates(e.target.value, dispatch),
                ]}
              />
            </Form.Item>
            <Form.Item name="scrapeSubmit">
              <Button
                type="primary"
                htmlType="submit"
                className={pastedUrl.length ? "btn-active" : "btn"}
                disabled={pastedUrl.length ? false : true}
                danger
                block
              >
                {duplicates.length ? "Proceed" : "Get Recipe"}
              </Button>
            </Form.Item>
          </Form>
          {duplicates.length ? (
            <>
              <Paragraph italic strong>
                Looks like you have already saved{" "}
                {duplicates.length > 1 ? "multiple recipes" : "a recipe"} with a
                similar URL:
              </Paragraph>
              <List
                itemLayout="horizontal"
                dataSource={duplicates}
                renderItem={(duplicate, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={64}
                          src={duplicate.img_src}
                        />
                      }
                      title={
                        <a href={duplicate.url} target="_blank">
                          {duplicate.title}
                        </a>
                      }
                      description={duplicate.description.slice(0, 100) + "..."}
                    />
                  </List.Item>
                )}
              />
            </>
          ) : null}
        </div>
      )}
    </Modal>
  );
};

export default RecipeEntry;
