import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Layout, Card, Col, Row, Statistic, Typography, Button } from "antd";
import { ArrowLeftOutlined, StarFilled } from "@ant-design/icons";

const Stats = () => {
  const [ratingsData, setRatingsData] = useState([
    { label: "Not Rated", total: 0 },
    { label: "1", total: 0 },
    { label: "2", total: 0 },
    { label: "3", total: 0 },
    { label: "4", total: 0 },
    { label: "5", total: 0 },
  ]);
  const [average, setAverage] = useState(0);

  const recipes = useSelector((state) => state.catalog.recipes);
  const navigate = useNavigate();

  const { Header, Content } = Layout;
  const { Title } = Typography;

  useEffect(() => {
    const dist = [
      { label: "0", total: 0 },
      { label: "1", total: 0 },
      { label: "2", total: 0 },
      { label: "3", total: 0 },
      { label: "4", total: 0 },
      { label: "5", total: 0 },
    ];
    let ave = 0;
    recipes.forEach((recipe) => {
      console.log(
        dist[recipe.rating],
        +dist[recipe.rating].total,
        +dist[recipe.rating].total + 1
      );
      ave = ave + +recipe.rating;
      return (dist[recipe.rating].total = +dist[recipe.rating].total + 1);
    });

    ave = ave / recipes.length;
    console.log(dist, ave);
    setRatingsData(dist);
    setAverage(ave);
  }, []);

  ChartJS.register();

  return (
    <Content className="flex flex-col justify-start items-center  pb-20">
      <Header className="w-full flex items-center bg-transparent relative">
        <Button
          className="absolute top-[15px] left-[5px] flex justify-center items-center bg-white"
          shape="circle"
          onClick={() => navigate("/catalog")}
        >
          <ArrowLeftOutlined />
        </Button>
        <Title level={3} className="!mb-0 mx-auto">
          Recipe Statistics
        </Title>
      </Header>
      <Row gutter={[16, 16]} className="w-full h-full flex justify-center">
        <Col sm={12} lg={6} className="w-full">
          <Card bordered={false} className="stat-card">
            <Statistic
              title="# of Saved Recipes"
              value={recipes.length}
              valueStyle={{ color: "#3f8600" }}
              //   prefix={<ArrowUpOutlined />}
              //   suffix="%"
            />
          </Card>
        </Col>
        <Col sm={12} lg={6} className="w-full">
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Average Rating"
              value={average}
              precision={2}
              // valueStyle={{ color: "#cf1322" }}
              //   prefix={<ArrowDownOutlined />}
              suffix={<StarFilled style={{ color: "#fadb14" }} />}
            />
          </Card>
        </Col>
      </Row>
      <Row className="mt-4 w-full h-full flex justify-center">
        <Col sm={12} lg={12} className="w-full px-2">
          <Card bordered={false} className="stat-card">
            <Bar
              options={{
                responsive: true,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Ratings",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Total",
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: "Ratings Distribution",
                  },
                  tooltip: {
                    enabled: false,
                  },
                  legend: {
                    display: false,
                  },
                },
              }}
              data={{
                title: "Total",
                labels: ratingsData.map((ratings, i) => {
                  if (!i) {
                    return "Not Rated";
                  } else {
                    return `${ratings.label} Stars`;
                  }
                }),
                datasets: [
                  {
                    label: "",
                    data: ratingsData.map((ratings) => ratings.total),
                    backgroundColor: "rgba(211,48,47, 0.7)",
                  },
                ],
              }}
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Stats;
