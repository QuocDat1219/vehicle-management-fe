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
import useAsync from "../hook/useAsync";
import ServiceVehicle from "../service/ServiceVehicle";
import { CloseOutlined } from "@ant-design/icons"; // Icon to remove tags

const Vehicle = () => {
  const [form] = useForm();
  const [form2] = useForm();
  const [form3] = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEditvehicleDrawer, setOpenEditVehicleDrawer] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [data, setData] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);

  // Xử lý thêm phương tiện
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        number_plate: values.number_plate,
        license_name: values.license_name,
        vehicle_type: values.vehicle_type,
      };

      console.log(data);

      const res = await ServiceVehicle.createVehicle(data);
      // Kiểm tra nếu response trả về có `detail` và `msg`
      if (res.detail && res.detail.msg === "Phương tiện này đã tồn tại") {
        message.error(res.detail.msg);
      } else {
        message.success("Thêm phương tiện mới thành công");
        setData(res.detail.data); // Cập nhật dữ liệu với danh sách thẻ trả về
        setLoading(false);
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi thêm phương tiện");
      setLoading(false);
    }
  };

  //Load dữ liệu phương tiện
  const { data: datavehicles, loading: loadingVehicle } = useAsync(() =>
    ServiceVehicle.getAllvehicle()
  );
  useEffect(() => {
    setData(datavehicles);
  }, [datavehicles]);

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Loại phương tiện",
      dataIndex: "vehicle_type",
      key: "vehicle_type",
      render: (text) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Phương tiện",
      dataIndex: "number_plate",
      key: "number_plate",
      render: (number_plate) => (
        <Tag color="green" style={{ fontWeight: "bold" }}>
          {number_plate}
        </Tag>
      ),
    },
    {
      title: "Giấy phép",
      dataIndex: "license_name",
      key: "license_name",
      render: (text) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
          {text}
        </div>
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
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Hiển thị modal xác nhận xóa
  const showDeleteModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };
  // Xóa khách hàng
  const handleDelete = async () => {
    try {
      const res = await ServiceVehicle.deleteVehicle(selectedRecord._id);
      if (res) {
        setData(res.detail.data);
        message.success("Xóa phương tiện thành công");
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
  //Bật drawer sửa thông tin
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

  //Bật drawer sửa thông biển số
  const openEditVehicleDrawer = (record) => {
    setCurrentRecord(record);
    form3.setFieldsValue(record);
    setOpenEditVehicleDrawer(true);
  };

  //Sửa thông tin khách hàng
  useEffect(() => {
    if (currentRecord && currentRecord.vehicle) {
      const fetchVehicles = async () => {
        try {
          const vehicles = await Promise.all(
            currentRecord.vehicle.map(async (vehicleObj) => {
              const id = vehicleObj._id || vehicleObj; // Lấy `_id` nếu là đối tượng, hoặc giá trị trực tiếp nếu là chuỗi
              return await ServiceVehicle.getVehicle(id);
            })
          );
          setVehicleList(
            vehicles
              .filter((v) => v !== null)
              .map((v) => ({
                _id: v._id,
                number_plate: v.number_plate,
              }))
          );
        } catch (error) {
          console.error("Lỗi khi lấy thông tin xe:", error);
        }
      };
      fetchVehicles();
    }
  }, [currentRecord]);

  // Sửa thông tin
  const onFinish2 = async (values) => {
    setLoading(true);
    try {
      const data = {
        number_plate: values.number_plate,
        license_name: values.license_name,
        vehicle_type: values.vehicle_type,
      };
      const res = await ServiceVehicle.editVehicle(currentRecord._id, data);
      if (res) {
        message.success("Sửa thông tin thành công");
        setData(res.data); // Cập nhật dữ liệu trong bảng
        setLoading(false);
        closeDrawer();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Có lỗi xảy ra khi sửa thông tin");
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
              Thêm phương tiện
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Table
            pagination={{ pageSize: 6 }}
            loading={loadingVehicle}
            dataSource={data}
            columns={columns}
          />
        </Col>
      </Row>
      <Modal
        title="Thêm phương tiện mới"
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
            label="Giấy phép"
            name="license_name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giấy phép!",
              },
            ]}
          >
            <Input placeholder="Nhập giấy phép" />
          </Form.Item>

          <Form.Item
            label="Biển số"
            name="number_plate"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập biển số xe!",
              },
            ]}
          >
            <Input placeholder="Nhập biển số xe" />
          </Form.Item>
          <Form.Item
            label="Loại phương tiện"
            name="vehicle_type"
            initialValue={"Car"}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại phương tiện!",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn loại phương tiện"
            >
              <Select.Option value={"Car"}>Xe ô tô</Select.Option>
              <Select.Option value={"Motocycle"}>Xe gắn máy</Select.Option>
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
            label="Giấy phép"
            name="license_name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giấy phép!",
              },
            ]}
          >
            <Input placeholder="Nhập giấy phép" />
          </Form.Item>

          <Form.Item
            label="Biển số"
            name="number_plate"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập biển số xe!",
              },
            ]}
          >
            <Input placeholder="Nhập biển số xe" />
          </Form.Item>
          <Form.Item
            label="Loại phương tiện"
            name="vehicle_type"
            initialValue={"Car"}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại phương tiện!",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn loại phương tiện"
            >
              <Select.Option value={"Car"}>Xe ô tô</Select.Option>
              <Select.Option value={"Motocycle"}>Xe gắn máy</Select.Option>
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
        title="Xác nhận xóa khách hàng"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa khách hàng <b>{selectedRecord?.username}</b>{" "}
          không?
        </p>
      </Modal>
    </div>
  );
};

export default Vehicle;
