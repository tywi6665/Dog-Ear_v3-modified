import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Layout, Button, Form, Input, Typography, Result } from "antd";

const ResetPasswordConfirm = () => {
  const [status, setStatus] = useState("");

  const [loginForm] = Form.useForm();
  const { uid, token } = useParams();
  const { Content } = Layout;
  const { Title, Paragraph } = Typography;

  const onFinish = (data) => {
    setStatus("");
    data.uid = uid;
    data.token = token;
    axios
      .post("/api/v1/users/reset_password_confirm/", data)
      .then((response) => {
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Reset password email failed");
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
      title="There was a problem during your password reset."
      extra={[
        <Paragraph>
          Please try <Link to="/send_reset_password">reset password</Link> again
          or contact service support for further help.
        </Paragraph>,
      ]}
    />
  );

  let successMessage = (
    <Result
      status="success"
      title="Your password has successfully been reset!"
      extra={[
        <Paragraph>
          You can <Link to="/login/">Login</Link> to your account with your new
          password.
        </Paragraph>,
      ]}
    />
  );

  let form = (
    <Form
      name="basic"
      form={loginForm}
      layout="vertical"
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
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
          Your New Password
        </Title>
      </div>
      <Form.Item
        label="New Password"
        name="new_password"
        rules={[
          {
            required: true,
            message: "Please input a new password!",
          },
        ]}
      >
        <Input.Password />
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

export default ResetPasswordConfirm;
