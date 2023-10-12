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

  axios.get(`/health`).then((res) => {
    console.log(res);
  });

  const items = [
    {
      key: "1",
      label: "Tab 1",
      children: (
        <>
          <a
            href={`${axios.defaults.baseURL}/prometheus/metrics`}
            target="_blank"
          >
            http://localhost:8000/prometheus/metrics/
          </a>
          <iframe
            src={`${axios.defaults.baseURL}/prometheus/metrics`}
            width="100%"
            height="200px"
          />
        </>
      ),
    },
    {
      key: "2",
      label: "Tab 2",
      children: "Content of Tab Pane 2",
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
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Card>
    </Content>
  );
};

export default Metrics;
