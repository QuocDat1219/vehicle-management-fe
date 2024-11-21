import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import ServiceUser from "./service/ServiceUser";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const isLogin = cookies.get("token");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const decodedToken = jwtDecode(isLogin);
        setRole(decodedToken?.role);
        await ServiceUser.getAllUser();
      } catch (error) {
        // Lỗi sẽ được xử lý bởi interceptor
      }
    };

    if (isLogin) {
      checkToken();
    }
  }, [isLogin]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogin) {
          return <Redirect to="/login" />;
        } else if (role && !allowedRoles.includes(role)) {
          return <Redirect to="/detect" />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
