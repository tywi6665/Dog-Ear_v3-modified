import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  get_Recipes,
  add_Recipe,
  set_SearchQuery,
  set_SortBy,
} from "./CatalogActions";
import { clear_Recipe } from "../recipe/RecipeActions";
import { set_ScrapedRecipe } from "../entry/EntryActions";
import RequireAuth from "../../utils/RequireAuth";
import RecipeCard from "../../components/RecipeCard";
import RecipeEntry from "../entry/Entry";
import { DogIcon } from "../../components/DogIcon";
import { v4 as uuidv4 } from "uuid";
import {
  Layout,
  Col,
  Row,
  Space,
  Select,
  AutoComplete,
  Spin,
  FloatButton,
  Result,
  Typography,
} from "antd";
import { PlusCircleOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Catalog = RequireAuth(({ dispatch, displayMessage }) => {
  const { Header, Content } = Layout;
  const { Paragraph } = Typography;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();

  const recipes = useSelector((state) => state.catalog.recipes);
  const filteredRecipes = useSelector((state) => state.catalog.filteredRecipes);
  const allOptions = useSelector(
    (state) => state.catalog.searchOptions.allOptions
  );
  const searchQuery = useSelector((state) => state.catalog.searchQuery);
  const sortBy = useSelector((state) => state.catalog.sortBy);
  const hasRetrievedData = useSelector(
    (state) => state.catalog.hasRetrievedData
  );

  useEffect(() => {
    get_Recipes(dispatch, sortBy, displayMessage);
    clear_Recipe(dispatch);
    if (searchQuery) {
      set_SearchQuery("", dispatch);
    }
  }, [recipes.length, sortBy]);

  const handleAddRecipe = (recipe) => {
    recipe.unique_id = uuidv4();
    add_Recipe(recipe, dispatch, displayMessage);
    set_ScrapedRecipe({}, dispatch);
    closeModal();
  };

  // Modal Functions
  const showModal = (type) => {
    document.body.style.overflow = "hidden";
    setEntryType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = "unset";
    // set_ScrapedRecipe({}, dispatch);
    // setIsSubmitted(false);
    setIsModalOpen(false);
    // setEntryType("");
  };

  return (
    <Content>
      <Layout className="min-h-full pb-[50px]">
        <Header className="sticky top-0 flex justify-between items-center !bg-white !p-2.5 border-b border-[#d32f2f] z-[1]">
          <div className="w-6/12">
            <Select
              className="max-w-full w-[200px]"
              labelInValue
              bordered={false}
              defaultValue={{ value: "Newest", label: "Newest" }}
              value={{ value: sortBy }}
              onChange={(value) => set_SortBy(value.value, dispatch)}
              options={[
                {
                  value: "-timestamp",
                  label: "Newest",
                },
                {
                  value: "timestamp",
                  label: "Oldest",
                },
                {
                  value: "-rating",
                  label: "Highest Rated",
                },
                {
                  value: "title",
                  label: "Title A-Z",
                },
                {
                  value: "-title",
                  label: "Title Z-A",
                },
                {
                  value: "-has_made",
                  label: "Has Been Cooked",
                },
                {
                  value: "has_made",
                  label: "Has NOT Been Cooked",
                },
              ]}
            />
          </div>
          <div className="w-6/12 text-right">
            <AutoComplete
              className="max-w-full w-[200px] text-left"
              onSelect={(value) => set_SearchQuery(value, dispatch)}
              onSearch={(value) => set_SearchQuery(value, dispatch)}
              allowClear
              value={searchQuery}
              placeholder="Search Recipes"
              options={
                allOptions
                  ? allOptions.map((option) => {
                      return {
                        value: option,
                        label: option,
                      };
                    })
                  : ""
              }
            />
          </div>
        </Header>
        <Content className="m-[15px]">
          <Row
            justify="space-around"
            xs="auto"
            gutter={[16, 16]}
            key={uuidv4()}
          >
            {filteredRecipes.length ? (
              filteredRecipes.map((recipe, i) => (
                <Col
                  xs={{ span: 12, offset: 0 }}
                  md={{ span: 8, offset: 0 }}
                  lg={{ span: 6, offset: 0 }}
                  xl={{ span: 4, offset: 0 }}
                  className="flex justify-center w-full"
                  key={uuidv4()}
                >
                  <RecipeCard recipe={recipe} key={uuidv4()} />
                </Col>
              ))
            ) : recipes.length && !filteredRecipes.length ? (
              <Space
                direction="vertical"
                className="w-full text-center mt-[50px] mb-[15px]"
              >
                <Result
                  className="m-auto bg-white w-[300px] p-4 border border-solid border-neutral-200 rounded-lg"
                  title="There are no recipes that match the search term"
                  extra={[
                    <Paragraph>
                      <em>
                        <strong>{searchQuery}</strong>
                      </em>
                      ...
                    </Paragraph>,
                  ]}
                />
              </Space>
            ) : (
              <Space
                direction="vertical"
                className="w-full text-center mt-[50px] mb-[15px]"
              >
                {hasRetrievedData && !recipes.length ? (
                  <Result
                    className="m-auto bg-white w-[300px] p-4 border border-solid border-neutral-200 rounded-lg"
                    title="You haven't saved any recipes yet."
                    extra={[
                      <Paragraph>
                        Use the blue button in the lower right-hand corner to
                        add a recipe.
                      </Paragraph>,
                    ]}
                  />
                ) : (
                  <Spin tip="Loading" size="large">
                    <div className="content" />
                  </Spin>
                )}
              </Space>
            )}
          </Row>
          <FloatButton.Group
            icon={<PlusCircleOutlined />}
            className="bottom-[105px]"
            type="primary"
            trigger="click"
          >
            <FloatButton
              icon={<DogIcon />}
              onClick={() => showModal("scrape")}
              tooltip={<div>Scrape a Recipe</div>}
            />
            <FloatButton
              onClick={(e) => [setIsSubmitted(true), showModal("blank")]}
              tooltip={<div>Blank Template</div>}
            />
            <FloatButton
              icon={<BarChartOutlined />}
              onClick={() => navigate("/stats")}
              tooltip={<div>Statistics</div>}
            />
          </FloatButton.Group>
          <FloatButton.BackTop
            className="bottom-[55px]"
            tooltip={<div>Back to Top</div>}
          />
        </Content>
      </Layout>
      {entryType ? (
        <RecipeEntry
          dispatch={dispatch}
          displayMessage={displayMessage}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          //   handleCreate={handleCreate}
          //   handleImageUpload={handleImageUpload}
          //   handleImageDelete={handleImageDelete}
          //   handleDelete={handleDelete}
          //   setUrl={setUrl}
          //   quickTagOptions={searchOptions.tags}
          handleAddRecipe={handleAddRecipe}
          entryType={entryType}
          setEntryType={setEntryType}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          // isUploading={isUploading}
          // setIsUploading={setIsUploading}
          // imageName={imageName}
          // setImageName={setImageName}
        />
      ) : null}
    </Content>
  );
});

export default Catalog;
