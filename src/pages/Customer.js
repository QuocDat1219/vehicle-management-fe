import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag ,
  Table,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import ServiceCustomer from "../service/ServiceCustomer";
import useAsync from "../hook/useAsync";

const Customer = () => {
  const [form] = useForm();
  const [form2] = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [data, setData] = useState([]);
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        fullname: values.fullname,
        address: values.address,
        phone: values.phone,
        username: values.username,
        password: checked === true ? "123456789" : values.password,
        role: values.role,
      };

      const res = await ServiceCustomer.userSignup(data);

      if (res) {
        message.success("Tạo tài khoản thành công");
        setLoading(false);
        const resUser = await ServiceCustomer.getAllUser();
        setData(resUser);
        form.resetFields();
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.detail.msg === "Không thể tạo người dùng mới") {
        message.warning("Tài khoản đã tồn tại");
        setLoading(false);
      }
    }
  };

  const { data: dataUser, loading: loadingUser } = useAsync(() =>
    ServiceCustomer.getAllUser()
  );
  useEffect(() => {
    setData(dataUser);
  }, [dataUser]);

  console.log(dataUser);
  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tài khoản",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      render: (_, { role }) => (
        <Tag color={role === "admin" ? "volcano" : "green"} key={role}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "created_at",
      key: "created_at",
      render: (text, record) => {
        const date = new Date(record.created_at);
        return date.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Chức năng",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            style={{ backgroundColor: "green" }}
            type="primary"
            onClick={() => openEditDrawer(record)}
          >
            Sửa
          </Button>
          <Button danger onClick={() => showDeleteModal(record)}>
            Xóa tài khoản
          </Button>
          {/* <Button onClick={() => changePasswordDefault(record)} type="dashed">
            Reset mật khẩu
          </Button> */}
        </Space>
      ),
    },
  ];

  // Hiển thị modal xác nhận xóa
  const showDeleteModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };
  const handleChange = async () => {
    try {
      const res = await ServiceCustomer.changePasswordDefault(selectedRecord._id);
      console.log(res);
      if (res) {
        message.success("Đã đặt lại mật khẩu mặt định");
        setIsModalVisible2(false);
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi");
      setIsModalVisible2(false);
    }
  };
  // Xác nhận xóa tài khoản
  const handleDelete = async () => {
    if (selectedRecord.role === "admin") {
      message.warning("Tài khoản là Admin không thể xóa");
      return;
    }
    try {
      const res = await ServiceCustomer.delectUser(selectedRecord._id);
      if (res) {
        setData(res.detail.data);
        message.success("Xóa tài khoản thành công");
        setIsModalVisible(false);
      }
    } catch (error) {
      console.log(error);

      message.error("Lỗi");
    }
  };

  // Hủy hành động xóa
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };
  const openEditDrawer = (record) => {
    console.log(record);

    setCurrentRecord(record);
    form2.setFieldsValue(record);
    setOpenDrawer(true);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
    form2.resetFields();
  };
  const onFinish2 = async (values) => {
    setLoading(true);
    try {
      const data = {
        role: values.role,
        fullname: values.fullname,
        address: values.address,
        phone: values.phone,
      };
      const res = await ServiceCustomer.editUser(currentRecord._id, data);
      if (res) {
        message.success("Sửa thông tin thành công");
        setData(res.detail.data);
        setLoading(false);
        closeDrawer();
      }
    } catch (error) {
      console.log(error);

      setLoading(false);
      closeDrawer();
    }
  };
  const changePasswordDefault = async (record) => {
    setSelectedRecord(record);
    setIsModalVisible2(true);
  };
  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full" title="Chức năng">
            <Button type="primary" onClick={() => setOpenModal(true)}>
              {" "}
              Thêm tài khoản
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Table
            pagination={{ pageSize: 6 }}
            loading={loadingUser}
            dataSource={data}
            columns={columns}
          />
        </Col>
      </Row>

      <Modal
        title="Thêm tài khoản"
        onCancel={() => setOpenModal(false)}
        visible={openModal}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="row-col"
        >
          <Form.Item
            label="Họ tên"
            name="fullname"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên!",
              },
            ]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ!",
              },
            ]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tài khoản!",
              },
            ]}
          >
            <Input placeholder="Nhập tài khoản" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              style={{
                padding: "0px 11px 0px 11px",
                borderRadius: "5px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Quyền"
            name="role"
            initialValue={"user"}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn quyền!",
              },
            ]}
          >
            <Select style={{ width: "100%" }} placeholder="Chọn quyền">
              <Select.Option value={"use"}>User</Select.Option>
              <Select.Option value={"admin"}>Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        title="Sửa thông tin tài khoản"
        width={400}
        onClose={closeDrawer}
        visible={openDrawer}
        footer={null}
      >
        <Form form={form2} onFinish={onFinish2} layout="vertical">
          <Form.Item
            label="Họ tên"
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="Quyền"
            name="role"
            initialValue={"user"}
            rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
          >
            <Select placeholder="Chọn quyền">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={loading}
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Xác nhận xóa tài khoản"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa tài khoản <b>{selectedRecord?.username}</b>{" "}
          không?
        </p>
      </Modal>
      <Modal
        title="Xác nhận đặt lại mật khẩu"
        visible={isModalVisible2}
        onOk={handleChange}
        onCancel={handleCancel2}
        okText="Đặt"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn đặt lại mật khẩu cho tài khoản{" "}
          <b>{selectedRecord?.username}</b> không?
        </p>
      </Modal>
    </div>
  );
};

export default Customer;
