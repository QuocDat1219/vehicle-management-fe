import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { FaRegCreditCard, FaUser } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Icon } from "../icon/icon.js";

const cookies = new Cookies();

function Sidenav({ color }) {
  const [decodedToken, setDecodedToken] = useState("");
  const { pathname } = useLocation();
  const page = pathname.replace("/", "");
  const { dashboard, bras } = Icon(color);

  useEffect(() => {
    const token = cookies.get("token");
    if (token) setDecodedToken(jwtDecode(token));
  }, []);

  return (
    <Menu theme="light" mode="inline">
      {decodedToken?.role === "admin" && (
        <>
          <Menu.Item className="menu-item-header" key="1">
            Quản lý
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/customer">
              <span
                className="icon"
                style={{ background: page === "customer" ? color : "" }}
              >
                <FaUser color={color} />
              </span>
              <span className="label">Tài khoản</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="3">
            <NavLink to="/card">
              <span
                className="icon"
                style={{ background: page === "card" ? color : "" }}
              >
                <FaRegCreditCard color={color} />
              </span>
              <span className="label">Thẻ</span>
            </NavLink>
          </Menu.Item>

          <Menu.Item key="2">
            <NavLink to="/user">
              <span
                className="icon"
                style={{ background: page === "khachhang" ? color : "" }}
              >
                <FaListCheck color={color} />
              </span>
              <span className="label">User</span>
            </NavLink>
          </Menu.Item>
        </>
      )}
    </Menu>
  );
}

export default Sidenav;
