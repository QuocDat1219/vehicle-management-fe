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
  Typography,
  Descriptions,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import useAsync from "../hook/useAsync";
import ServiceUser from "./../service/ServiceUser";
import ServiceVehicle from "../service/ServiceVehicle";
import { CloseOutlined } from "@ant-design/icons"; // Icon to remove tags

const User = () => {
  const [form] = useForm();
  const [form2] = useForm();
  const [form3] = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEditvehicleDrawer, setOpenEditVehicleDrawer] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [onOpenUserDetailDrawer, setOpenUserDetailDrawer] = useState(false);
  const [data, setData] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);

  // Xử lý thêm khách hàng mới
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        full_name: values.full_name,
        identity_card: values.identity_card,
        address: values.address,
        phone: values.phone,
        vehicle: selectedVehicles, // Đưa các ID của xe vào đây
      };

      console.log(data);

      const res = await ServiceUser.createUser(data);

      if (res) {
        message.success("Tạo tài khoản thành công");
        setLoading(false);
        form.resetFields();
        setSelectedVehicles([]); // Reset danh sách xe đã chọn
        setOpenModal(false);
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi tạo tài khoản");
      setLoading(false);
    }
  };

  //Load dữ liệu người dùng đăng ký
  const { data: dataUser, loading: loadingUser } = useAsync(() =>
    ServiceUser.getAllUser()
  );
  useEffect(() => {
    setData(dataUser);
  }, [dataUser]);

  //Load dữ liệu phương tiện
  const { data: dataVehicle, loading: loadingVehicle } = useAsync(() =>
    ServiceVehicle.getAllvehicle()
  );
  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Căn cước",
      dataIndex: "identity_card",
      key: "identity_card",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Phương tiện",
      dataIndex: "vehicle",
      key: "vehicle",
      render: (vehicles) =>
        vehicles.map((v) => (
          <div key={v._id}>
            {/* Container div */}
            <div style={{ marginTop: "10px" }}>
              <Tag color="green" key={v._id}>
                {v.number_plate}
              </Tag>
              <div>
                <Descriptions.Item>
                  Giấy phép:{" "}
                  <Typography.Text style={{ fontWeight: "bold" }}>
                    {v.license_name}
                  </Typography.Text>
                </Descriptions.Item>
              </div>
              <div>
                <Descriptions.Item>
                  Loại phương tiện:{" "}
                  <Typography.Text style={{ fontWeight: "bold" }}>
                    {v.vehicle_type}
                  </Typography.Text>
                </Descriptions.Item>
              </div>
            </div>
          </div>
        )),
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
        <div>
          {/* Grouping Sửa and Xóa buttons */}
          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
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

          {/* Đổi biển số button positioned below */}
          <Button
            onClick={() => openEditVehicleDrawer(record)}
            type="dashed"
            style={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
          >
            Đổi biển số
          </Button>
          <div>
            {" "}
            <Button
              onClick={() => openUserDetailDrawer(record)}
              style={{ width: "100%" }}
            >
              Chi tiết
            </Button>
          </div>
          {/* Chi tiết button positioned below Đổi biển số */}
        </div>
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
      const res = await ServiceUser.changePasswordDefault(selectedRecord._id);
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

  // Xóa khách hàng
  const handleDelete = async () => {
    try {
      const res = await ServiceUser.delectUser(selectedRecord._id);
      if (res) {
        setData(res.detail.data);
        message.success("Xóa khách hàng thành công");
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

  const closeEditVehicleDrawer = () => {
    setOpenEditVehicleDrawer(false);
    form3.resetFields();
  };

  //Bật drawer
  const openUserDetailDrawer = async (record) => {
    const res = await ServiceUser.getUser(record._id);
    console.log(res);
    if (res) {
      setCurrentRecord(res);
      setOpenUserDetailDrawer(true);
    }
  };

  const closeUserDetailDrawer = () => {
    setOpenUserDetailDrawer(false);
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

  // Xóa biển số người dùng
  const handleRemoveTag = async (id) => {
    // Cập nhật trạng thái cục bộ bằng cách xóa phương tiện khỏi danh sách phương tiện và phương tiện được chọn
    setVehicleList((prev) => prev.filter((v) => v._id !== id));
    setSelectedVehicles((prev) => prev.filter((v) => v !== id));
    try {
      const response = await ServiceUser.removeVehicleUser(currentRecord._id, {
        vehicle: [id],
      });
      if (response) {
        setData(response);
        message.success("Đã xóa phương tiện!");
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi xóa phương tiện");
    }
  };

  // Sửa thông tin
  const onFinish2 = async (values) => {
    setLoading(true);
    try {
      const data = {
        full_name: values.full_name,
        identity_card: values.identity_card,
        address: values.address,
        phone: values.phone,
      };

      const res = await ServiceUser.editUser(currentRecord._id, data);
      if (res) {
        console.log(res);

        message.success("Sửa thông tin thành công");
        setData(res); // Cập nhật dữ liệu trong bảng
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
  // Sửa biển số
  const onEditvehicle = async (values) => {
    setLoading(true);
    try {
      const data = {
        vehicle: selectedVehicles, // Lưu danh sách xe đã chọn
      };

      const res = await ServiceUser.editVehicleUser(currentRecord._id, data);
      if (res) {
        message.success("Cập nhật thành công");
        setData(res); // Cập nhật dữ liệu trong bảng
        setLoading(false);
        closeEditVehicleDrawer();
      }
    } catch (error) {
      setLoading(false);
      message.error(error.response.data.detail.msg);
      closeEditVehicleDrawer();
    }
  };

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full" title="Chức năng">
            <Button type="primary" onClick={() => setOpenModal(true)}>
              {" "}
              Thêm khách hàng
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
        title="Thêm  khách hàng mới"
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
            name="full_name"
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
            label="Căn cước công dân"
            name="identity_card"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập căn cước công dân!",
              },
            ]}
          >
            <Input placeholder="Nhập căn cước công dân" />
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
                message: "Vui lòng số điện thoại!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Phương tiện"
            name="vehicle"
            rules={[{ required: true, message: "Hãy chọn phương tiện" }]}
            style={{ marginBottom: 10 }}
          >
            <Select
              mode="multiple" // Cho phép chọn nhiều
              showSearch
              style={{ width: "100%" }}
              placeholder="Chọn phương tiện"
              loading={loadingVehicle}
              onChange={(value) => setSelectedVehicles(value)} // Cập nhật danh sách xe đã chọn
            >
              {dataVehicle?.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.number_plate}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Hiển thị biển số xe đã chọn */}
          <div style={{ marginBottom: 10 }}>
            {selectedVehicles.map((id) => {
              const vehicle = dataVehicle?.find((v) => v._id === id);
              return (
                <Tag color="blue" key={id} style={{ marginBottom: 5 }}>
                  {vehicle?.number_plate}
                </Tag>
              );
            })}
          </div>
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

      {/* Sửa thông tin khách hàng */}

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
            name="full_name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Số căn cước"
            name="identity_card"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
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
      <Drawer
        title="Sửa thông tin phương tiện cá nhân"
        width={400}
        onClose={closeEditVehicleDrawer}
        visible={openEditvehicleDrawer}
        footer={null}
      >
        <Form form={form3} onFinish={onEditvehicle} layout="vertical">
          <Form.Item label="Phương tiện đã chọn">
            <div style={{ marginBottom: 10 }}>
              {vehicleList.map((v) => (
                <Tag
                  color="blue"
                  key={v._id}
                  name="vehicle"
                  closable
                  onClose={() => handleRemoveTag(v._id)}
                  closeIcon={<CloseOutlined />}
                >
                  {v.number_plate}
                </Tag>
              ))}
            </div>
            <Select
              mode="multiple"
              showSearch
              style={{ width: "100%" }}
              placeholder="Thêm phương tiện"
              loading={loadingVehicle}
              onChange={(value) => setSelectedVehicles(value)}
            >
              {dataVehicle?.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.number_plate}
                </Select.Option>
              ))}
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

      <Drawer
        title="Chi tiết khách hàng"
        width={400}
        onClose={closeUserDetailDrawer}
        visible={onOpenUserDetailDrawer}
      >
        <Descriptions
          bordered
          column={1}
          size="mall"
          labelStyle={{ fontWeight: "bold" }}
        >
          <Descriptions.Item label="Họ tên">
            {currentRecord?.full_name || "rỗng"}
          </Descriptions.Item>
          <Descriptions.Item label="Số căn cước">
            {currentRecord?.identity_card || "rỗng"}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {currentRecord?.address || "rỗng"}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {currentRecord?.phone || "rỗng"}
          </Descriptions.Item>
          <Descriptions.Item label="Phương tiện">
            {currentRecord?.vehicle && currentRecord.vehicle.length > 0 ? (
              currentRecord.vehicle.map((v) => (
                <div>
                  <Tag color="green" key={v._id}>
                    {v.number_plate}
                  </Tag>
                  <div style={{ marginTop: "5px" }}>
                    <Descriptions.Item>
                      Giấy phép:{" "}
                      <Typography.Text>{v.license_name}</Typography.Text>
                    </Descriptions.Item>
                  </div>
                  <div>
                    <Descriptions.Item>
                      Loại phương tiện:{" "}
                      <Typography.Text>{v.vehicle_type}</Typography.Text>
                    </Descriptions.Item>
                  </div>
                  <br />
                </div>
              ))
            ) : (
              <Typography.Text type="secondary">rỗng</Typography.Text>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {currentRecord?.created_at &&
            !isNaN(new Date(currentRecord?.created_at).getTime())
              ? new Date(currentRecord?.created_at).toLocaleString()
              : "00:00"}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày cập nhật">
            {currentRecord?.updated_at &&
            !isNaN(new Date(currentRecord?.updated_at).getTime())
              ? new Date(currentRecord?.updated_at).toLocaleString()
              : "00:00"}
          </Descriptions.Item>
        </Descriptions>
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

export default User;
