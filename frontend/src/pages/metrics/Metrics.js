import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Layout, Card, Typography, Button, Tabs } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const Metrics = () => {
  const navigate = useNavigate();

  const { Header, Content } = Layout;
  const { Title } = Typography;

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: "1",
      label: "Health",
      children: (
        <iframe
          src={`${axios.defaults.baseURL}/health/`}
          width="100%"
          height="300px"
        />
      ),
    },
    {
      key: "2",
      label: "Metrics",
      children: (
        <iframe
          src={`${axios.defaults.baseURL}/prometheus/metrics`}
          width="100%"
          height="500px"
        />
      ),
    },
  ];

  return (
    <Content className="flex flex-col justify-start items-center px-2.5 pb-20">
      <Header className="w-full flex items-center bg-transparent relative">
        <Button
          className="absolute top-[15px] left-[5px] flex justify-center items-center bg-white"
          shape="circle"
          onClick={() => navigate("/catalog")}
        >
          <ArrowLeftOutlined />
        </Button>
        <Title level={3} className="!mb-0 mx-auto">
          Site Metrics
        </Title>
      </Header>
      <Card bordered={false} className="metrics-card w-full">
        <Tabs
          defaultActiveKey="1"
          className="w-full"
          items={items}
          onChange={onChange}
        />
      </Card>
    </Content>
  );
};

export default Metrics;
