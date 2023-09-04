import React, { useState } from "react";
import { Layout, Button, Form, Input, Typography, Result } from "antd";
import { Link } from "react-router-dom";
import { signupNewUser } from "./SignupAction";
import { useNavigate } from "react-router-dom";

const Signup = ({ dispatch, displayMessage, destroyMessage }) => {
  const [status, setStatus] = useState("");

  const [loginForm] = Form.useForm();
  const { Content } = Layout;
  const { Title, Paragraph } = Typography;
  const navigate = useNavigate();

  const onFinish = (userData) => {
    destroyMessage();
    signupNewUser(userData, dispatch, navigate, displayMessage, setStatus);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("signup failed");
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      username: "${label} is not a valid username!",
    },
  };

  let errorMessage = (
    <Result
      status="error"
      title="There was a problem creating your account."
      extra={[
        <Paragraph>
          Please try again or contact service support for further help.
        </Paragraph>,
        <Button
          type="primary"
          onClick={() => setStatus("")}
          className="btn-active"
        >
          Try Again
        </Button>,
      ]}
    />
  );

  let successMessage = (
    <Result
      status="success"
      title="Account Created Successfully!"
      extra={[
        <Paragraph>
          We sent you an email with your activation link. Please check your
          email.
        </Paragraph>,
        <Paragraph>
          Please try again or contact us if you do not receive it within a few
          minutes.
        </Paragraph>,
      ]}
    />
  );

  let form = (
    <Form
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
      validateMessages={validateMessages}
    >
      <div className="h-[50px] flex justify-between mb-[25px]">
        <Title className="m-[5px]" level={3}>
          Make an Account
        </Title>
      </div>
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="first_name"
        label="First Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            type: "email",
            required: true,
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
        <Paragraph>
          Already have account? <Link to="/login">Login</Link>
        </Paragraph>
      </Form.Item>
    </Form>
  );

  let message = "";
  if (status === "error") {
    message = errorMessage;
  } else if (status === "success") {
    message = successMessage;
  }

  return (
    <Content className="h-full flex justify-center items-center fixed inset-0">
      <div className="bg-white w-[300px] p-4 border border-solid border-neutral-200 rounded-lg">
        {message}
        {!status.length && form}
      </div>
    </Content>
  );
};

export default Signup;
