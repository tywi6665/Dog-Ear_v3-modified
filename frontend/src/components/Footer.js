import React from "react";
import { useLocation } from "react-router-dom";
import { Layout, Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";

const Footer = () => {
  const recipes = useSelector((state) => state.catalog.recipes);
  const user = useSelector((state) => state.login.user);
  let location = useLocation();
  const { Footer } = Layout;
  const { Text } = Typography;

  return (
    <Footer className="w-full fixed bottom-0 z-[1] !bg-white border-t border-[#d32f2f] text-center !p-2.5">
      {location.pathname === "/catalog" ? (
        <Row justify={"center"}>
          <Col>
            {recipes ? (
              <Text italic>
                Welcome <strong>{user.username}</strong>, you have saved{" "}
                {recipes.length} recipes to date!
              </Text>
            ) : null}
          </Col>
        </Row>
      ) : location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname.split("/")[1] === "activate" ||
        location.pathname.split("/")[1] === "resend_activation" ||
        location.pathname.split("/")[1] === "reset_password" ? (
        <Text italic strong>
          Welcome to Dog-Ear
        </Text>
      ) : (
        <Text italic strong>
          Mmmmm this looks tasty!
        </Text>
      )}
    </Footer>
  );
};

export default Footer;
