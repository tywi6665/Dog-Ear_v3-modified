import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  Upload,
  List,
  Avatar,
  Typography,
} from "antd";
import { titleCase, titleCaseArr, parseIngredients } from "../../utils";
// import {
//   directUploadStart,
//   directUploadDo,
//   directUploadFinish,
// } from "../../utils/upload";
import { UploadOutlined } from "@ant-design/icons";
// import { v4 as uuidv4 } from "uuid";

const RecipeEntry = ({
  //   recipe,
  //   unique_id,
  //   url,
  //   setRecipe,
  dispatch,
  displayMessage,
  isModalOpen,
  closeModal,
  handleAddRecipe,
  //   setUrl,
  //   handleCreate,
  //   // handleImageUpload,
  //   // handleImageDelete,
  //   handleDelete,
  //   quickTagOptions,
  entryType,
  setEntryType,
  isSubmitted,
  setIsSubmitted,
  // isUploading,
  // setIsUploading,
  // imageName,
  // setImageName,
}) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [hasMade, setHasMade] = useState(false);
  const [rating, setRating] = useState(0);
  //   const [urlNotNeeded, setUrlNotNeeded] = useState(false);

  const user = useSelector((state) => state.login.user.username);
  const scrapedRecipe = useSelector(
    (state) => state.scrapedRecipe.scrapedRecipe
  );
  const pastedUrl = useSelector((state) => state.scrapedRecipe.url);
  const hadError = useSelector((state) => state.scrapedRecipe.hadError);
  const tagOptions = [
    ...useSelector((state) => state.catalog.searchOptions.tags),
  ];
  const duplicates = useSelector((state) => state.catalog.duplicates);
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
    const recipe = {
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
                  <Form.Item label="Recipe URL" name="url">
                    <div>
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={entryType === "blank" ? false : true}
                      />
                    </div>
                  </Form.Item>

                  <Form.Item label="Recipe Image">
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
                    rules={[
                      {
                        required: true,
                        message: "Please input the recipe's title!",
                      },
                    ]}
                  >
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="Recipe Author" name="author">
                    <Input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="Recipe Description" name="description">
                    <TextArea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      autoSize={{ minRows: 1, maxRows: 4 }}
                    />
                  </Form.Item>

                  <Form.Item label="Recipe Tags" name="tags">
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
                        autoSize={{ minRows: 3 }}
                      />
                    </Tooltip>
                  </Form.Item>

                  <Form.Item label="Recipe Steps" name="steps">
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={title.length ? "btn-active" : "btn"}
                      disabled={title.length ? false : true}
                      danger
                      block
                    >
                      Create Entry
                    </Button>
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
              <p className="text-center">
                <em>Fetching deliciousness...</em>
              </p>
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
