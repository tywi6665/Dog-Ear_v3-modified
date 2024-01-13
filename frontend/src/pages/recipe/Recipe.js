import React, { useState, useEffect, useRef } from "react";
import RequireAuth from "../../utils/RequireAuth";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { get_Recipe, patch_Recipe, delete_Recipe } from "./RecipeActions";
import {
  Select,
  Layout,
  Space,
  Typography,
  Divider,
  Button,
  Rate,
  Tabs,
  Timeline,
  Input,
  Tag,
  Form,
  Modal,
  Spin,
  Dropdown,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  ExclamationCircleFilled,
  SettingOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { titleCase, testJSON, flattenIntoString_new } from "../../utils";
import parse, { domToReact } from "html-react-parser";
import { parseIngredient } from "parse-ingredient";

const Recipe = RequireAuth(({ dispatch, displayMessage }) => {
  const catalog = useSelector((state) => state.catalog);
  const searchOptions = useSelector((state) => state.catalog.searchOptions);
  const recipe = useSelector((state) => state.recipe.recipe);
  // const [inputVisible, setInputVisible] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [addTagVisible, setAddTagVisible] = useState(false);
  const [addTagSubmittable, setAddTagSubmittable] = useState(false);
  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const [addNoteSubmittable, setAddNoteSubmittable] = useState(false);
  const [tagForm] = Form.useForm();
  const [noteForm] = Form.useForm();
  let tagFormValue = Form.useWatch("newTag", tagForm);
  let noteFormValue = Form.useWatch("newNote", noteForm);
  let { id } = useParams();
  const navigate = useNavigate();
  const { Title, Paragraph, Text, Link } = Typography;
  const { Content } = Layout;
  const { confirm } = Modal;

  const inputRef = useRef(null);

  useEffect(() => {
    get_Recipe(id, dispatch, displayMessage);
  }, []);

  useEffect(() => {
    if (Object.keys(catalog).length) {
      setAllTags(searchOptions.tags);
    }
  }, [catalog]);

  useEffect(() => {
    if (Object.keys(recipe).length) {
      if (recipe.notes.length && typeof recipe.notes[0] === "string") {
        const notesJSON = [];
        recipe.notes.forEach((note) => {
          if (moment(note.split(":")[0]).isValid()) {
            notesJSON.push({
              date: note.split(":")[0],
              text: note.split(":")[1].trim(),
            });
          } else {
            notesJSON.push({
              date: "",
              text: note.trim(),
            });
          }
        });
        patch_Recipe(recipe.id, { notes: notesJSON }, dispatch, displayMessage);
      }
    }
  }, [recipe]);

  useEffect(() => {
    if (Object.keys(recipe).length) {
      const parsedSteps = JSON.parse(recipe.steps);
      const newSteps = [];
      if (
        parsedSteps.length === 1 &&
        !parsedSteps[0].header.length &&
        !parsedSteps[0].content.length
      ) {
        patch_Recipe(recipe.id, { steps: "[]" }, dispatch, displayMessage);
      } else if (
        parsedSteps.length >= 1 &&
        parsedSteps[0].hasOwnProperty("content")
      ) {
        parsedSteps.forEach((step) => {
          if (step.header.length) {
            newSteps.push({
              isGroupHeader: true,
              description: step.header,
            });
          }
          if (step.content.length) {
            step.content.forEach((st) => {
              newSteps.push({
                isGroupHeader: false,
                description: st,
              });
            });
          }
        });
        patch_Recipe(
          recipe.id,
          { steps: JSON.stringify(newSteps) },
          dispatch,
          displayMessage
        );
      }
    }
  }, [recipe]);

  useEffect(() => {
    if (Object.keys(recipe).length) {
      const parsedIngredients = JSON.parse(recipe.ingredients);
      if (
        parsedIngredients.length === 1 &&
        !parsedIngredients[0].header.length &&
        !parsedIngredients[0].content.length
      ) {
        patch_Recipe(
          recipe.id,
          { ingredients: "[]" },
          dispatch,
          displayMessage
        );
      }
    }
  }, [recipe]);

  useEffect(() => {
    noteForm
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setAddNoteSubmittable(true);
        },
        () => {
          setAddNoteSubmittable(false);
        }
      );
  }, [noteFormValue]);

  useEffect(() => {
    if (tagFormValue) {
      if (tagFormValue.length && tagFormValue[0]) {
        if (tagFormValue[0].newTag.length) {
          setAddTagSubmittable(true);
        } else {
          setAddTagSubmittable(false);
        }
      } else {
        setAddTagSubmittable(false);
      }
    } else {
      setAddTagSubmittable(false);
    }
  }, [tagFormValue]);

  // Tab Functions
  const changeTab = (key) => {
    return;
  };

  // Dropdown Functions
  const items = [
    {
      label: "Edit Recipe",
      key: "1",
      icon: <EditOutlined />,
    },
    {
      label: "Delete Recipe",
      key: "2",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure delete this recipe?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        delete_Recipe(recipe.id, navigate, displayMessage);
      },
      onCancel() {},
    });
  };

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      navigate("edit");
    } else {
      showDeleteConfirm();
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const addTags = (newTags) => {
    const isPresent = newTags.map((tag) => recipe.tags.indexOf(titleCase(tag)));
    const recipeTagsCopy = [...recipe.tags];
    const validTags = [];
    isPresent.forEach((tagIndex, i) => {
      if (tagIndex === -1) {
        validTags.push(newTags[i]);
        recipeTagsCopy.push(titleCase(newTags[i]));
      } else {
        displayMessage(
          `This recipe already has the ${newTags[i]} tag`,
          "error"
        );
      }
    });
    if (validTags.length) {
      patch_Recipe(
        recipe.id,
        { tags: recipeTagsCopy },
        dispatch,
        displayMessage
      );
      setAddTagVisible(false);
      setAddTagSubmittable(false);
    } else {
      setAddTagVisible(false);
      setAddTagSubmittable(false);
    }
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
      // let tagFormValueCopy = [
      //   ...tagFormValue[0].newTag,
      //   titleCase(newTagTrimmed),
      // ];
      // tagFormValue[0].newTag = tagFormValueCopy;
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

  // const showInput = () => {
  //   setInputVisible(true);
  // };

  const addNote = () => {
    let trimmedValue = noteFormValue[0].newNote.trim();
    const timestamp = moment().format("MM/DD/YYYY");
    if (trimmedValue.length) {
      patch_Recipe(
        recipe.id,
        { notes: [...recipe.notes, { date: timestamp, text: trimmedValue }] },
        dispatch,
        displayMessage
      );
      noteForm.resetFields();
      setAddNoteVisible(false);
    }
  };

  const generateTimeline = (items, type) => {
    items = JSON.parse(items);
    if (!items.length) {
      return (
        <Timeline>
          <Timeline.Item color="#d32f2f">
            <Paragraph italic>
              This recipe has no {type} assigned to it
            </Paragraph>
          </Timeline.Item>
        </Timeline>
      );
    } else {
      return (
        <Timeline key={uuidv4()}>
          {items.map((item, i) => {
            return item.isGroupHeader ? (
              <Timeline.Item
                color="#d32f2f"
                className="!border-none timeline-header"
                position="left"
                key={uuidv4()}
              >
                <Title level={5} strong italic className="!mb-0">
                  {item.description}
                </Title>
              </Timeline.Item>
            ) : (
              <Timeline.Item
                color="#d32f2f"
                className={
                  items[i + 1] && items[i + 1].isGroupHeader
                    ? "timeline-last"
                    : ""
                }
                key={uuidv4()}
              >
                {item.quantity ? <Text strong>{item.quantity}</Text> : null}
                {item.quantity2 ? <Text strong>-{item.quantity2}</Text> : null}
                {item.unitOfMeasure ? (
                  <Text strong italic>
                    {" "}
                    {item.unitOfMeasure}{" "}
                  </Text>
                ) : (
                  " "
                )}
                <Text>{item.description}</Text>
              </Timeline.Item>
            );
          })}
        </Timeline>
      );
    }
  };

  return typeof recipe === "object" && Object.keys(recipe).length ? (
    <Layout className="w-full pt-0 pb-20">
      <Content>
        <Row className="w-full">
          <Col
            className="flex justify-center items-center flex-col gap-2.5"
            xs={{ span: 24, offset: 0 }}
            sm={{ span: 22, offset: 1 }}
            md={{ span: 20, offset: 2 }}
            lg={{ span: 18, offset: 3 }}
          >
            <Row className="w-full">
              <Col className="w-full relative">
                <Button
                  className="absolute top-[5px] left-[5px] flex justify-center items-center bg-white"
                  shape="circle"
                  onClick={() => navigate("/catalog")}
                >
                  <ArrowLeftOutlined />
                </Button>
                <img
                  className="w-full max-w-full max-h-[550px] object-center object-cover"
                  src={
                    recipe.img_src
                      ? recipe.img_src
                      : "/static/graphics/default_image.jpg"
                  }
                />
                <div className="absolute top-[30%] bottom-0 inset-0 bg-gradient-to-b from-transparent to-[#f5f5f5]"></div>
                {/* </div> */}
              </Col>
            </Row>
            <Row className="w-full -mt-20">
              <Col span={20} offset={2}>
                <Title level={3} className="text-center mb-0">
                  {recipe.title}
                </Title>
              </Col>
            </Row>
            <Row>
              <Col>
                <Text>
                  <strong>Author: </strong>
                  <em>
                    {recipe.author ? recipe.author : "No Assigned Author"}
                  </em>
                </Text>
              </Col>
            </Row>
            <Row>
              <Col className="flex flex-center gap-5">
                <Button
                  type={recipe.has_made ? "primary" : "default"}
                  className={recipe.has_made ? "btn-active mt-px" : "btn mt-px"}
                  onClick={(e) =>
                    patch_Recipe(
                      recipe.id,
                      { has_made: !recipe.has_made },
                      dispatch,
                      displayMessage
                    )
                  }
                  danger
                  shape="circle"
                >
                  <CheckOutlined />
                </Button>
                <Rate
                  value={recipe.rating}
                  onChange={(rating) =>
                    patch_Recipe(
                      recipe.id,
                      { rating: rating },
                      dispatch,
                      displayMessage
                    )
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Text className="text-gray-500">
                  <small>
                    <strong>Saved On: </strong>
                    {moment(recipe.timestamp).format("MMMM Do YYYY")}
                  </small>
                </Text>
              </Col>
            </Row>
            {/* <div className="recipe-div"> */}
            <Row
              className="w-full max-w-[825px]"
              gutter={[16, 16]}
              style={{
                padding: "0 calc(8px + 1.5625vw)",
              }}
            >
              <Col span={20} className="!pl-0">
                {recipe.url.length ? (
                  <Link href={recipe.url} target="_blank" className="w-full">
                    <Button className="btn-active" type="primary" block danger>
                      Visit Recipe Webpage <LinkOutlined />
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full btn" block danger disabled>
                    Visit Recipe Webpage <LinkOutlined />
                  </Button>
                )}
              </Col>
              <Col span={4} className="!pr-0">
                <Dropdown menu={menuProps}>
                  <Button className="w-full">
                    <SettingOutlined />
                  </Button>
                </Dropdown>
              </Col>
            </Row>
            {/* </div> */}
            <Row
              className="w-full"
              style={{
                padding: "0 calc(8px + 1.5625vw)",
              }}
            >
              <Col span={24}>
                <Tabs
                  defaultActiveKey="1"
                  onChange={changeTab}
                  items={[
                    {
                      label: `Description`,
                      key: "1",
                      children: recipe.description ? (
                        recipe.description.split("\n").map((paragraph) => {
                          if (paragraph.length) {
                            return (
                              <Paragraph key={uuidv4()}>
                                {parse(paragraph, {
                                  replace({ domNode, attribs, children }) {
                                    if (!attribs) {
                                      return;
                                    }
                                    if (attribs.href) {
                                      return (
                                        <a href={attribs.href} target="_blank">
                                          {domToReact(children)}
                                        </a>
                                      );
                                    }
                                  },
                                })}
                              </Paragraph>
                            );
                          }
                        })
                      ) : (
                        <Text italic>There is no description for this</Text>
                      ),
                    },
                    {
                      label: `Tags/Notes`,
                      key: "2",
                      children: (
                        <>
                          <Divider orientation="left">
                            <Text strong italic>
                              Tagged As:
                            </Text>
                          </Divider>
                          {recipe.tags.length > 0 ? (
                            recipe.tags.map((tag) => {
                              return (
                                <Tag
                                  color="#d32f2f"
                                  key={uuidv4()}
                                  className="w-fit mr-2 mb-1 align-top"
                                >
                                  {titleCase(tag)}
                                </Tag>
                              );
                            })
                          ) : (
                            <p>
                              <em>This recipe has not been tagged yet</em>
                            </p>
                          )}
                          {/* {inputVisible && ( */}
                          <Form
                            name="new-tag-form"
                            form={tagForm}
                            className="flex flex-col mt-2.5"
                            onFinish={(value) => (
                              value.newTag[0].newTag
                                ? addTags(value.newTag[0].newTag)
                                : null,
                              tagForm.resetFields()
                            )}
                          >
                            {/* <Form.Item name="newTag">
                                <Input
                                  type="text"
                                  size="small"
                                  className="mt-1 mr-0 rounded-r-none"
                                  placeholder="Add a new tag"
                                />
                              </Form.Item>
                              <Form.Item>
                                <Button
                                  className="btn-active mt-1 h-[24px] py-0 px-2.5 rounded-l-none"
                                  htmlType="submit"
                                  type="primary"
                                  disabled={tagFormValue ? false : true}
                                >
                                  Add
                                </Button>
                              </Form.Item> */}
                            <Form.List name="newTag">
                              {(fields, { add, remove }) => (
                                <>
                                  {fields.map(({ key, name, ...restField }) => (
                                    <div
                                      key={key}
                                      className="flex justify-start items-center gap-2 mb-2.5"
                                    >
                                      {/* <Form.Item
                                        {...restField}
                                        name={[name, "newTag"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please leave a tag",
                                          },
                                        ]}
                                        className="m-0"
                                      >
                                        <Input.TextArea
                                          className="rounded w-full"
                                          placeholder="Add a new tag"
                                          allowClear
                                          autoSize
                                        />
                                      </Form.Item> */}
                                      <Form.Item
                                        {...restField}
                                        name={[name, "newTag"]}
                                        className="m-0"
                                      >
                                        <Select
                                          style={{
                                            width: 300,
                                          }}
                                          mode="multiple"
                                          allowClear
                                          placeholder="Add tags"
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
                                                  onChange={(e) =>
                                                    setNewTag(e.target.value)
                                                  }
                                                  onKeyDown={(e) =>
                                                    e.stopPropagation()
                                                  }
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
                                          options={allTags.map((item) => ({
                                            label: item.title,
                                            value: item.value,
                                          }))}
                                        />
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        onClick={() => [
                                          remove(name),
                                          setAddTagVisible(false),
                                        ]}
                                      />
                                    </div>
                                  ))}
                                  <Form.Item>
                                    {addTagVisible ? (
                                      <Button
                                        className="h-full btn-active rounded"
                                        htmlType="submit"
                                        type="primary"
                                        disabled={!addTagSubmittable}
                                      >
                                        Submit
                                      </Button>
                                    ) : (
                                      <Button
                                        type="dashed"
                                        className="border-[#d32f2f] hover:!border-[#d32f2f]"
                                        onClick={() => [
                                          add(),
                                          setAddTagVisible(true),
                                        ]}
                                        icon={<PlusOutlined />}
                                      >
                                        Add New Tag
                                      </Button>
                                    )}
                                  </Form.Item>
                                </>
                              )}
                            </Form.List>
                          </Form>
                          {/* )} */}
                          {/* {!inputVisible && (
                            <div>
                              <Tag
                                className="my-1 border border-dashed border-[#d32f2f]"
                                onClick={showInput}
                              >
                                <PlusOutlined /> New Tag
                              </Tag>
                            </div>
                          )} */}
                          <Divider orientation="left">
                            <Text strong italic>
                              Notes:
                            </Text>
                          </Divider>
                          <Form
                            className="mb-5"
                            name="new-notes-form"
                            form={noteForm}
                            autoComplete="off"
                            onFinish={(value) => addNote(value.newNote)}
                          >
                            {/* <Form.Item className="w-full" name="newNote">
                              <Input.TextArea
                                className="rounded-r-none"
                                placeholder="Add a new note"
                                allowClear
                                autoSize
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button
                                className="h-full btn-active rounded-l-none"
                                htmlType="submit"
                                type="primary"
                                disabled={noteFormValue ? false : true}
                              >
                                Add
                              </Button>
                            </Form.Item> */}
                            <Form.List name="newNote">
                              {(fields, { add, remove }) => (
                                <>
                                  {fields.map(({ key, name, ...restField }) => (
                                    <div
                                      key={key}
                                      className="flex justify-center items-center gap-2 mb-2.5"
                                    >
                                      <Form.Item
                                        {...restField}
                                        name={[name, "newNote"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please leave a note",
                                          },
                                        ]}
                                        className="w-full m-0"
                                      >
                                        <Input.TextArea
                                          className="rounded w-full"
                                          placeholder="Add a new note"
                                          allowClear
                                          autoSize
                                        />
                                      </Form.Item>
                                      <MinusCircleOutlined
                                        onClick={() => [
                                          remove(name),
                                          setAddNoteVisible(false),
                                        ]}
                                      />
                                    </div>
                                  ))}
                                  <Form.Item>
                                    {addNoteVisible ? (
                                      <Button
                                        className="h-full btn-active rounded"
                                        htmlType="submit"
                                        type="primary"
                                        disabled={!addNoteSubmittable}
                                        block
                                      >
                                        Submit
                                      </Button>
                                    ) : (
                                      <Button
                                        type="dashed"
                                        className="border-[#d32f2f] hover:!border-[#d32f2f]"
                                        onClick={() => [
                                          add(),
                                          setAddNoteVisible(true),
                                        ]}
                                        block
                                        icon={<PlusOutlined />}
                                      >
                                        Add New Note
                                      </Button>
                                    )}
                                  </Form.Item>
                                </>
                              )}
                            </Form.List>
                          </Form>
                          <Timeline>
                            {(recipe.notes.length &&
                              typeof recipe.notes[0] === "object") > 0 ? (
                              recipe.notes.map((note) => {
                                return (
                                  <Timeline.Item color="#d32f2f" key={uuidv4()}>
                                    <Text>
                                      {note.date.length ? (
                                        <em>
                                          <strong>{note.date}:&nbsp;</strong>
                                        </em>
                                      ) : null}
                                      {note.text}
                                    </Text>
                                  </Timeline.Item>
                                );
                              })
                            ) : (
                              <Timeline.Item color="#d32f2f">
                                <Text italic>This recipe has no notes yet</Text>
                              </Timeline.Item>
                            )}
                          </Timeline>
                        </>
                      ),
                    },
                    {
                      label: `Recipe`,
                      key: "3",
                      children: (
                        <>
                          <Divider orientation="left" orientationMargin="0">
                            <Title level={4}>Ingredients:</Title>
                          </Divider>
                          {generateTimeline(recipe.ingredients, "ingredients")}
                          <Divider orientation="left" orientationMargin="0">
                            <Title level={4}>Steps:</Title>
                          </Divider>
                          {generateTimeline(recipe.steps, "steps")}
                        </>
                      ),
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  ) : (
    <Space direction="vertical" className="w-full mt-[50px] mb-[15px]">
      <Spin tip="Loading" size="large">
        <div className="content" />
      </Spin>
    </Space>
  );
});

export default Recipe;
