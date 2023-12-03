import React, { useState, useEffect } from "react";
import RequireAuth from "../../utils/RequireAuth";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { get_Recipe, patch_Recipe, delete_Recipe } from "./RecipeActions";
import {
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
import { titleCase, testJSON } from "../../utils";
import parse, { domToReact } from "html-react-parser";
// import { parse } from "recipe-ingredient-parser-v3";

const Recipe = RequireAuth(({ dispatch, displayMessage }) => {
  const recipe = useSelector((state) => state.recipe.recipe);
  const [inputVisible, setInputVisible] = useState(false);
  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const [addNoteSubmittable, setAddNoteSubmittable] = useState(false);
  const [tagForm] = Form.useForm();
  const [noteForm] = Form.useForm();
  let tagFormValue = Form.useWatch("newTag", tagForm);
  let noteFormValue = Form.useWatch("newNote", noteForm);
  let { id } = useParams();
  const navigate = useNavigate();
  const { Title, Paragraph, Text, Link } = Typography;
  const { Header, Content } = Layout;
  const { confirm } = Modal;

  useEffect(() => {
    get_Recipe(id, dispatch, displayMessage);
  }, []);

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
        console.log(notesJSON);
        patch_Recipe(recipe.id, { notes: notesJSON }, dispatch, displayMessage);
      }
    }
  }, [recipe]);

  React.useEffect(() => {
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

  const handleInputConfirm = (newTag) => {
    if (recipe.tags.indexOf(titleCase(newTag)) === -1) {
      patch_Recipe(
        recipe.id,
        { tags: [...recipe.tags, titleCase(newTag)] },
        dispatch,
        displayMessage
      );
      setInputVisible(false);
    } else {
      displayMessage(`This recipe already has the ${newTag} tag`, "error");
    }
  };

  const showInput = () => {
    setInputVisible(true);
  };

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
    if (!items[0].content.length) {
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
      return items.map((item) => {
        if (item.header.length) {
          return (
            <React.Fragment key={uuidv4()}>
              <Paragraph strong italic className="!my-5">
                {item.header}
              </Paragraph>
              <Timeline>
                {item.content.map((el) => {
                  return (
                    <Timeline.Item color="#d32f2f" key={uuidv4()}>
                      <Text>{el}</Text>
                    </Timeline.Item>
                  );
                })}
              </Timeline>
            </React.Fragment>
          );
        } else {
          return (
            <Timeline key={uuidv4()}>
              {item.content.map((el) => {
                return (
                  <Timeline.Item color="#d32f2f" key={uuidv4()}>
                    <Text>{el}</Text>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          );
        }
      });
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
                {/* <div className="recipe-div"> */}
                {/* <div className="recipe-div-actions"> */}

                {/* <Radio.Group style={{ width: "100%", textAlign: "center" }}>
              <Popconfirm
                key="delete"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                title="Are you sure??"
                okText="Delete"
                okType="danger"
                placement="bottom"
                // onConfirm={() => (
                // handleDelete(recipe.unique_id, "recipes"),
                // onClose()
                // )}
              >
                <Radio.Button style={{ width: "50%" }} className="btn">
                  <DeleteOutlined />
                </Radio.Button>
              </Popconfirm>
              <Radio.Button
                style={{ width: "50%" }}
                // onClick={() => setIsEditing(true)}
              >
                <EditOutlined key="edit" />
              </Radio.Button>
            </Radio.Group> */}
                {/* </div> */}
                <img
                  className="w-full max-w-full max-h-[550px] object-center object-cover"
                  src={
                    recipe.img_src
                      ? recipe.img_src
                      : "/static/graphics/default_image.jpg"
                  }
                />
                <div className="absolute top-[40%] bottom-0 inset-0 bg-gradient-to-b from-transparent to-[#f5f5f5]"></div>
                {/* </div> */}
              </Col>
            </Row>
            <Row className="w-full -mt-10">
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
                          {inputVisible && (
                            <Form
                              name="new-tag-form"
                              form={tagForm}
                              className="flex"
                              onFinish={(value) => (
                                value.newTag
                                  ? handleInputConfirm(value.newTag.trim())
                                  : null,
                                tagForm.resetFields()
                              )}
                            >
                              <Form.Item name="newTag">
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
                              </Form.Item>
                            </Form>
                          )}
                          {!inputVisible && (
                            <div>
                              <Tag
                                className="my-1 border border-dashed border-[#d32f2f]"
                                onClick={showInput}
                              >
                                <PlusOutlined /> New Tag
                              </Tag>
                            </div>
                          )}
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
                            <Title level={5}>Ingredients:</Title>
                          </Divider>
                          {generateTimeline(recipe.ingredients, "ingredients")}
                          <Divider orientation="left" orientationMargin="0">
                            <Title level={5}>Steps:</Title>
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
