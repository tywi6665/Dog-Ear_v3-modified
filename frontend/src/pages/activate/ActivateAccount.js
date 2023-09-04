import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout, Button, Typography, Result } from "antd";

const ActivateAccount = () => {
  const [status, setStatus] = useState("");
  const { uid, token } = useParams();
  const { Content } = Layout;
  const { Paragraph } = Typography;

  useEffect(() => {
    axios
      .post("/api/v1/users/activation/", { uid, token })
      .then((response) => {
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
      });
  }, []);

  let errorMessage = (
    <Result
      status="error"
      title="There was a problem during account activation."
      extra={[
        <Paragraph>
          Please click <Link to="/resend_activation">here</Link> try again or
          contact service support for further help.
        </Paragraph>,
      ]}
    />
  );

  let successMessage = (
    <Result
      status="success"
      title="Your account has been activated!"
      extra={[
        <Paragraph>
          You can <Link to="/login">Login</Link> to your account.
        </Paragraph>,
      ]}
    />
  );

  let loadingMessage = (
    <Result
      title="Your account is being activated!"
      extra={[<Paragraph>Please Wait...</Paragraph>]}
    />
  );

  let message = "";
  if (status === "error") {
    message = errorMessage;
  } else if (status === "success") {
    message = successMessage;
  } else {
    message = loadingMessage;
  }

  return (
    <Content className="h-full flex justify-center items-center fixed inset-0">
      <div className="bg-white w-[300px] p-4 border border-solid border-neutral-200 rounded-lg">
        {message}
      </div>
    </Content>
  );
};

export default ActivateAccount;
