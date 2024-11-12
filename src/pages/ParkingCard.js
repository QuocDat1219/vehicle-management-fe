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
  Tag,
  Table,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import ServiceParkingCard from "../service/ServiceParkingCard";
import useAsync from "../hook/useAsync";

const ParkingCard = () => {
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

  // Thêm dữ liệu cho thẻ
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        id_card: values.id_card,
        role: values.role,
      };

      const res = await ServiceParkingCard.createParkingCrad(data);
      console.log(res);

      // Kiểm tra nếu response trả về có `detail` và `msg`
      if (res.detail && res.detail.msg === "Thẻ đã được đăng ký") {
        message.error(res.detail.msg);
      } else {
        message.success("Đăng ký thẻ mới thành công");
        setData(res); // Cập nhật dữ liệu với danh sách thẻ trả về
      }

      setLoading(false);
      form.resetFields();
      setOpenModal(false);
    } catch (error) {
      message.error("Xảy ra lỗi khi đăng ký thẻ");
      setLoading(false);
      form.resetFields();
      setOpenModal(false);
    }
  };

  const { data: dataParkingCard, loading: loadingCard } = useAsync(() =>
    ServiceParkingCard.getAllPakingCard()
  );
  useEffect(() => {
    setData(dataParkingCard);
  }, [dataParkingCard]);
  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Id thẻ",
      dataIndex: "id_card",
      key: "id_card",
    },
    {
      title: "Phương tiện",
      dataIndex: "vehicle",
      key: "vehicle",
      render: (vehicles) =>
        vehicles.map((v) => (
          <Tag color="green" style={{ fontWeight: "bold" }} key={v._id}>
            {v.number_plate + "\n"}
          </Tag>
        )),
    },
    {
      title: "Trạng thái thẻ",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={status === "Using" ? "green" : "volcano"} key={status}>
          {status === "Using" ? "Đã kích hoạt" : "Chưa kích hoạt"}
        </Tag>
      ),
    },
    {
      title: "Loại thẻ",
      dataIndex: "role",
      key: "role",
      render: (_, { role }) => (
        <Tag color={role === "Normal" ? "default" : "blue"} key={role}>
          {role === "Normal" ? "Mặc định" : "Khách hàng"}
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
            Hủy thẻ
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

  // Xác nhận hủy thẻ
  const handleDelete = async () => {
    try {
      const res = await ServiceParkingCard.delectParkingCard(
        selectedRecord.id_card
      );
      if (res) {
        setData(res.detail.data);
        message.success("Hủy thẻ thành công");
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

  //Mở drawer sửa
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

  //Sửa thông tin thẻ
  const onFinish2 = async (values) => {
    setLoading(true);
    try {
      const data = {
        role: values.role,
      };
      const res = await ServiceParkingCard.editCard(currentRecord._id, data);
      console.log(res);

      if (res) {
        message.success("Sửa thông tin thành công");
        setData(res.detail.data);
        setLoading(false);
        closeDrawer();
      }
    } catch (error) {
      console.log(error);
      message.error(error.response.data.detail.msg);
      setLoading(false);
      closeDrawer();
    }
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full" title="Chức năng">
            <Button type="primary" onClick={() => setOpenModal(true)}>
              {" "}
              Đăng ký thẻ mới
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Table
            pagination={{ pageSize: 6 }}
            loading={loadingCard}
            dataSource={data}
            columns={columns}
          />
        </Col>
      </Row>

      <Modal
        title="Đăng ký thẻ mới"
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
            label="Id thẻ"
            name="id_card"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập id thẻ!",
              },
            ]}
          >
            <Input placeholder="Nhập id thẻ" />
          </Form.Item>

          <Form.Item
            label="Loại thẻ"
            name="role"
            initialValue={"default"}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại thẻ!",
              },
            ]}
          >
            <Select style={{ width: "100%" }} placeholder="Chọn loại thẻ">
              <Select.Option value={"default"}>Mặc định</Select.Option>
              <Select.Option value={"client"}>Khách hàng</Select.Option>
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
        title="Sửa thông tin thẻ"
        width={400}
        onClose={closeDrawer}
        visible={openDrawer}
        footer={null}
      >
        <Form form={form2} onFinish={onFinish2} layout="vertical">
          <Form.Item
            label="Chọn loại thẻ"
            name="role"
            initialValue={"user"}
            rules={[{ required: true, message: "Vui lòng chọn loại thẻ!" }]}
          >
            <Select placeholder="Chọn loại thẻ">
              <Select.Option value="Normal">Mặc định</Select.Option>
              <Select.Option value="Client">Khách hàng</Select.Option>
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
        title="Xác nhận hủy thẻ"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn hủy thẻ <b>{selectedRecord?.id_card}</b> không?
        </p>
      </Modal>
    </div>
  );
};

export default ParkingCard;
