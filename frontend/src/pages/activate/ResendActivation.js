import React, { useState } from "react";
import axios from "axios";
import { Layout, Button, Form, Input, Typography, Result } from "antd";

const ResendActivation = () => {
  const [status, setStatus] = useState("");

  const [loginForm] = Form.useForm();
  const { Content } = Layout;
  const { Title, Paragraph } = Typography;

  const onFinish = (userData) => {
    axios
      .post("/api/v1/users/resend_activation/", userData)
      .then((response) => {
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Resend activation email failed");
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
    },
  };

  let errorMessage = (
    <Result
      status="error"
      title="Problem sending your activation email."
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
      title="Activation Email sent!"
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
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={(userData) => onFinish(userData)}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      validateMessages={validateMessages}
    >
      <div>
        <Title className="m-[5px]" level={3}>
          Resend Activation Email
        </Title>
        <Paragraph className="m-[5px]" strong>
          Your account is inactive. Please activate account by sending the email
          with activation link.
        </Paragraph>
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
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" className="btn-active">
          Submit
        </Button>
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

export default ResendActivation;
