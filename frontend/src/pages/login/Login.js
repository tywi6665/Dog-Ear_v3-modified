import React from "react";
import { login } from "./LoginActions";
import { Layout, Button, Form, Input, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ dispatch, displayMessage, destroyMessage }) => {
  const [loginForm] = Form.useForm();
  const { Content } = Layout;
  const { Title, Text } = Typography;
  const navigate = useNavigate();

  const onFinish = (userData) => {
    destroyMessage();
    login(userData, "/catalog", navigate, dispatch, displayMessage);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("login failed");
  };

  return (
    <Content className="h-full flex justify-center items-center fixed inset-0">
      <Form
        className="bg-white p-4 border border-solid border-neutral-200 rounded-lg"
        name="basic"
        form={loginForm}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={(userData) => onFinish(userData)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="h-[50px] flex justify-between mb-[25px]">
          <Title className="m-[5px]" level={3}>
            Please Log In
          </Title>
        </div>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 9,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit" className="btn-active">
            Submit
          </Button>
        </Form.Item>
        <Form.Item
          className="mb-0"
          wrapperCol={{
            offset: 1,
            span: 24,
          }}
        >
          <Text>
            Forgot Password?{" "}
            <Link to="/send_reset_password">Reset Password</Link>
          </Text>
          <br />
          <Text>
            Need an account? <Link to="/signup">Sign Up</Link>
          </Text>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default Login;
