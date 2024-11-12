import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import {
  Row,
  Col,
  Breadcrumb,
  Button,
  Drawer,
  Typography,
  Switch,
  Modal,
  Form,
  Input,
  message,
} from "antd";

import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Icon } from "../icon/icon";
import { RiLockPasswordFill } from "react-icons/ri";
import ServiceUser from "../../service/ServiceCustomer";
import { SettingFilled } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

const ButtonContainer = styled.div`
  .ant-btn-primary {
    background-color: #1890ff;
  }
  .ant-btn-success {
    background-color: #52c41a;
  }
  .ant-btn-yellow {
    background-color: #fadb14;
  }
  .ant-btn-black {
    background-color: #262626;
    color: #fff;
    border: 0px;
    border-radius: 5px;
  }
  .ant-switch-active {
    background-color: #1890ff;
  }
`;

const { setting, toggler, profile } = Icon({ color: "black" });

function Header({
  placement,
  name,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const { Title, Text } = Typography;
  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState("");
  const [oldPassWord, setOldPassWord] = useState("");
  const [newPassWord, setNewPassWord] = useState("");
  const [rpNewPassWord, setRpNewPassWord] = useState("");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [changePWModalVisible, setchangePWModalVisible] = useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  useEffect(() => window.scrollTo(0, 0));
  useEffect(() => {
    const myCookieValue = cookies.get("token");
    setToken(myCookieValue);

    if (myCookieValue) {
      const decodedToken = jwtDecode(myCookieValue);
      setDecodedToken(decodedToken);
    }
  }, []);

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  const handleLogout = () => {
    cookies.remove("token");
    setLogoutModalVisible(false);
    window.location.href = "/login"; // Redirect to login page
  };

  const showLogoutModal = () => setLogoutModalVisible(true);
  const hideLogoutModal = () => setLogoutModalVisible(false);
  const showChangePWModal = () => setchangePWModalVisible(true);
  const hideChangePWModal = () => setchangePWModalVisible(false);
  const handlerChangePassword = async () => {
    setLoadingChangePassword(true);
    if (!oldPassWord) {
      message.warning("Nhập mật khẩu cũ");
      setLoadingChangePassword(false);
      return;
    }
    if (!newPassWord) {
      message.warning("Nhập mật khẩu mới");
      setLoadingChangePassword(false);
      return;
    }
    if (!rpNewPassWord) {
      message.warning("Nhập lại mật khẩu");
      setLoadingChangePassword(false);
      return;
    }
    if (newPassWord !== rpNewPassWord) {
      message.warning("Mật khẩu nhập lại không trùng khớp");
      setLoadingChangePassword(false);
      return;
    }

    try {
      const res = await ServiceUser.changePassword({
        old_password: oldPassWord,
        new_password: newPassWord,
      });
      if (res.detail.msg === "Đổi mật khẩu thành công") {
        message.success("Đổi mật khẩu thành công");
        setLoadingChangePassword(false);
        setchangePWModalVisible(false);
      }
    } catch (error) {
      setLoadingChangePassword(false);

      if (error.response.data.detail === "Mật khẩu cũ không đúng") {
        message.warning("Mật khẩu cũ không đúng");
      }
    }
  };

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={6}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <NavLink to="/">Trang</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ textTransform: "capitalize" }}>
              {name.replace("/", "")}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="ant-page-header-heading">
            <span
              className="ant-page-header-heading-title"
              style={{ textTransform: "capitalize", color: "white" }}
            >
              Hệ thống quản lý nhà xe
            </span>
          </div>
        </Col>
        <Col span={24} md={18} className="header-control">
          <Button type="link" onClick={showDrawer}>
            <SettingFilled color="#fff" style={{ color: "white" }} />
          </Button>
          <Button type="link" onClick={showChangePWModal}>
            <RiLockPasswordFill />{" "}
            <span className="btn-login">Đổi mật khẩu</span>
          </Button>
          <Button
            type="link"
            className="sidebar-toggler"
            onClick={() => onPress()}
          >
            {toggler}
          </Button>
          <Drawer
            className="settings-drawer"
            mask={true}
            width={360}
            onClose={hideDrawer}
            placement={placement}
            visible={visible}
          >
            <div layout="vertical">
              <div className="header-top">
                <Title level={4}>
                  Trình cấu hình
                  <Text className="subtitle">
                    Xem các tùy chọn bảng điều khiển của chúng tôi.
                  </Text>
                </Title>
              </div>

              <div className="sidebar-color">
                <Title level={5}>Màu thanh bên</Title>
                <div className="theme-color mb-2">
                  <ButtonContainer>
                    <Button
                      type="primary"
                      onClick={() => handleSidenavColor("#1890ff")}
                    >
                      1
                    </Button>
                    <Button
                      type="success"
                      onClick={() => handleSidenavColor("#52c41a")}
                    >
                      1
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => handleSidenavColor("#d9363e")}
                    >
                      1
                    </Button>
                    <Button
                      type="yellow"
                      onClick={() => handleSidenavColor("#fadb14")}
                    >
                      1
                    </Button>

                    <Button
                      type="black"
                      onClick={() => handleSidenavColor("#111")}
                    >
                      1
                    </Button>
                  </ButtonContainer>
                </div>

                <div className="sidebarnav-color mb-2">
                  <Title level={5}>Loại thanh bên</Title>
                  <Text>Chọn giữa 2 loại thanh bên khác nhau.</Text>
                  <ButtonContainer className="trans">
                    <Button
                      type={sidenavType === "transparent" ? "primary" : "white"}
                      onClick={() => {
                        handleSidenavType("transparent");
                        setSidenavType("transparent");
                      }}
                    >
                      Trong suốt
                    </Button>
                    <Button
                      type={sidenavType === "white" ? "primary" : "white"}
                      onClick={() => {
                        handleSidenavType("#fff");
                        setSidenavType("white");
                      }}
                    >
                      Trắng
                    </Button>
                  </ButtonContainer>
                </div>
                <div className="fixed-nav mb-2">
                  <Title level={5}>Thanh điều hướng cố định</Title>
                  <Switch onChange={(e) => handleFixedNavbar(e)} />
                </div>
              </div>
            </div>
          </Drawer>
          {token === undefined || token === null ? (
            <Link to="/login" className="btn-login">
              {profile}
              <span>Sign in</span>
            </Link>
          ) : (
            <>
              <Button type="link" onClick={showLogoutModal}>
                {profile}

                <span className="btn-login">Đăng xuất</span>
              </Button>
              <Text style={{ color: "white" }}>{decodedToken.fullname}</Text>
            </>
          )}
        </Col>
      </Row>
      <Modal
        title="Đổi mật khẩu"
        visible={changePWModalVisible}
        onOk={handlerChangePassword}
        onCancel={hideChangePWModal}
        okText="Đổi mật khẩu"
        cancelText="Hủy"
        confirmLoading={loadingChangePassword}
      >
        <Form
          labelCol={{ span: 7 }}
          initialValues={{
            size: "small",
          }}
          layout="horizontal"
          size={"small"}
          className="form-card"
        >
          <Form.Item label="Mật khẩu cũ" name={"oldPassWord"}>
            <Input.Password
              placeholder="Nhập mật khẩu cũ"
              onChange={(e) => setOldPassWord(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name={"newPassWord"}>
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => setNewPassWord(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Nhập lại mật khẩu " name={"rpNewPassWord"}>
            <Input.Password
              placeholder="Nhập lại mật khẩu "
              onChange={(e) => setRpNewPassWord(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Đăng xuất"
        visible={logoutModalVisible}
        onOk={handleLogout}
        onCancel={hideLogoutModal}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <h3 style={{ color: "#747d8c" }}>Bạn chắc chắn muốn đăng xuất?</h3>
      </Modal>
    </>
  );
}

export default Header;
