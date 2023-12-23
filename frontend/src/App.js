import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useMatch,
} from "react-router-dom";
import axios from "axios";
import { set_CurrentUser, set_Token } from "./pages/login/LoginActions";
import { isEmpty } from "./utils/";
import { Layout, message } from "antd";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/login/Login";
import ActivateAccount from "./pages/activate/ActivateAccount";
import ResendActivation from "./pages/activate/ResendActivation";
import ResetPassword from "./pages/password/ResetPassword";
import ResetPasswordConfirm from "./pages/password/ResetPasswordConfirm";
import Signup from "./pages/signup/Signup";
import Catalog from "./pages/catalog/Catalog";
import Recipe from "./pages/recipe/Recipe";
import RecipeEdit from "./pages/edit/RecipeEdit";
import Stats from "./pages/stats/Stats";
import Metrics from "./pages/metrics/Metrics";
import NotFoundPage from "./components/NotFoundPage";
import ErrorPage from "./components/ErrorPage";
import { useWakeLock } from "react-screen-wake-lock";
import { get_Recipes } from "./pages/catalog/CatalogActions";

if (window.location.origin === "http://localhost:3000") {
  axios.defaults.baseURL = "http://localhost:3000";
} else {
  axios.defaults.baseURL = window.location.origin;
}

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  let match = useMatch("catalog/recipe/:id");
  let activateMatch = useMatch("activate/:uid/:token");
  let resetPasswordMatch = useMatch("reset_password/:uid/:token");

  const displayMessage = (message, type) => {
    messageApi.open({
      type: type,
      content: message,
      duration: 3,
    });
  };

  const destroyMessage = () => {
    messageApi.destroy();
  };

  const { isSupported, released, request, release } = useWakeLock({
    onRequest: () => console.log("Screen Wake Lock: requested!"),
    onError: () => console.log("An error happened 💥"),
    onRelease: () => console.log("Screen Wake Lock: released!"),
  });

  useEffect(() => {
    // check localStorage
    if (!isEmpty(localStorage.getItem("de_token"))) {
      set_Token(localStorage.getItem("de_token"), dispatch);
    }
    if (!isEmpty(localStorage.getItem("de_user"))) {
      const user = JSON.parse(localStorage.getItem("de_user"));
      let redirectTo;
      if (
        location.pathname === "/signup" ||
        location.pathname === "/login" ||
        location.pathname === "/"
      ) {
        redirectTo = "/catalog";
      } else {
        redirectTo = location.pathname;
      }
      set_CurrentUser(user, redirectTo, navigate, dispatch);
      get_Recipes(dispatch, "-timestamp", "", displayMessage);
    } else {
      if (
        activateMatch ||
        resetPasswordMatch ||
        location.pathname === "/signup" ||
        location.pathname === "/resend_activation" ||
        location.pathname === "/send_reset_password"
      ) {
        navigate(location.pathname);
      } else {
        navigate("/login");
      }
    }
  }, []);

  useEffect(() => {
    if (match && isSupported) {
      request();
    } else if (!match && !released) {
      release();
    }
  }, [location]);

  return (
    <Layout className="min-h-full">
      <Navbar />
      {contextHolder}
      <Routes>
        <Route
          path="login"
          element={
            <Login
              dispatch={dispatch}
              displayMessage={displayMessage}
              destroyMessage={destroyMessage}
            />
          }
          errorElement={<ErrorPage />}
        />
        <Route
          path="activate/:uid/:token"
          element={<ActivateAccount />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="resend_activation"
          element={<ResendActivation />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="reset_password/:uid/:token"
          element={<ResetPasswordConfirm />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="send_reset_password"
          element={<ResetPassword />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="signup"
          element={
            <Signup
              dispatch={dispatch}
              displayMessage={displayMessage}
              destroyMessage={destroyMessage}
            />
          }
          errorElement={<ErrorPage />}
        />
        <Route
          path="catalog"
          element={
            <Catalog
              dispatch={dispatch}
              displayMessage={displayMessage}
              destroyMessage={destroyMessage}
            />
          }
          errorElement={<ErrorPage />}
        />
        <Route
          path="catalog/recipe/:id"
          element={
            <Recipe dispatch={dispatch} displayMessage={displayMessage} />
          }
          errorElement={<ErrorPage />}
        />
        <Route
          path="catalog/recipe/:id/edit"
          element={
            <RecipeEdit dispatch={dispatch} displayMessage={displayMessage} />
          }
          errorElement={<ErrorPage />}
        />
        <Route
          path="stats"
          element={
            <Stats dispatch={dispatch} displayMessage={displayMessage} />
          }
          errorElement={<ErrorPage />}
        />
        {/* <Route
          path="metrics"
          element={<Metrics />}
          errorElement={<ErrorPage />}
        /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Outlet />
      <Footer />
    </Layout>
  );
};

export default App;
