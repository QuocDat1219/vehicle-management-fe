import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom";
const PageNotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Button type="primary">
        <Link to="/bras">
          <span>Trở lại</span>
        </Link>
      </Button>
    }
  />
);
export default PageNotFound;
