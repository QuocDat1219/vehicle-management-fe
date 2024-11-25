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
  Descriptions,
  Typography,
  DatePicker,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState, useRef } from "react";
import ServiceParkingCard from "../service/ServiceParkingCard";
import ServiceUser from "../service/ServiceUser";
import ServiceVehicle from "../service/ServiceVehicle";
import useAsync from "../hook/useAsync";
import { CloseOutlined } from "@ant-design/icons";

const ParkingCard = () => {
  const [form] = useForm();
  const [form2] = useForm();
  const [form3] = useForm();
  const idCardRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openEditvehicleDrawer, setOpenEditVehicleDrawer] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [onOpenCardDetailDrawer, setOpenCardDetailDrawer] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [data, setData] = useState([]);
  const [showExtraFields, setShowExtraFields] = useState(false);

  // Thêm dữ liệu cho thẻ
  useEffect(() => {
    if (openModal) {
      // Focus vào input khi modal mở
      idCardRef.current?.focus();
    }
  }, [openModal]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        id_card: values.id_card,
        role: values.role,
        user: values.user || "",
        start_date: values.start_date || "",
        end_date: values.end_date || "",
        card_fee: Number(values.card_fee) || 0,
      };

      const res = await ServiceParkingCard.createParkingCrad(data);
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
  const { data: dataUser, loading: loadingUser } = useAsync(() =>
    ServiceUser.getAllUser()
  );
  const { data: dataVehicle, loading: loadingVehicle } = useAsync(() =>
    ServiceVehicle.getAllvehicle()
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
      title: "Khách hàng",
      dataIndex: "user_card",
      key: "user_card",
      render: (user_card) => (
        <span color="green" style={{ fontWeight: "bold" }} key={user_card?._id}>
          {user_card?.full_name || ""}
        </span>
      ),
    },
    {
      title: "Trạng thái thẻ",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={status === "Using" ? "green" : "volcano"} key={status}>
          {status === "Using" ? "Đang sử dụng" : "Đang chờ"}
        </Tag>
      ),
    },
    {
      title: "Loại thẻ",
      dataIndex: "role",
      key: "role",
      render: (_, { role }) => (
        <Tag color={role === "Normal" ? "yellow" : "blue"} key={role}>
          {role === "Normal" ? "Thẻ thường" : "Thẻ tháng"}
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
        <div>
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
              Hủy thẻ
            </Button>
          </Space>
          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            <Button
              onClick={() => openEditVehicleDrawer(record)}
              type="dashed"
              style={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
            >
              Đổi biển số
            </Button>
            <Button
              onClick={() => openCardDetailDrawer(record)}
              type="dashed"
              style={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
            >
              Chi tiết
            </Button>
          </Space>
        </div>
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
  // Hiển thị thông tin biển số
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

  //Xóa biển số
  const handleRemoveTag = async (id) => {
    // Cập nhật trạng thái cục bộ bằng cách xóa phương tiện khỏi danh sách phương tiện và phương tiện được chọn
    setVehicleList((prev) => prev.filter((v) => v._id !== id));
    setSelectedVehicles((prev) => prev.filter((v) => v !== id));
    try {
      const response = await ServiceParkingCard.removeVehicleCard(
        currentRecord._id,
        {
          vehicle: [id],
        }
      );
      if (response) {
        setData(response);
        message.success("Đã xóa phương tiện!");
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi xóa phương tiện");
    }
  };
  // Sửa biển số
  const onEditvehicle = async (values) => {
    setLoading(true);
    try {
      const data = {
        vehicle: selectedVehicles, // Lưu danh sách xe đã chọn
      };

      const res = await ServiceParkingCard.editVehicleCard(
        currentRecord._id,
        data
      );
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

  //Sửa thông tin thẻ
  const onFinish2 = async (values) => {
    setLoading(true);
    try {
      const data = {
        role: values.role,
        user: values.user,
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

  //Bật drawer
  const openCardDetailDrawer = async (record) => {
    const res = await ServiceParkingCard.getParkingCard(record.id_card);
    console.log(res);
    if (res) {
      setCurrentRecord(res);
      setOpenCardDetailDrawer(true);
    }
  };

  const closeCarDetailDrawer = () => {
    setOpenCardDetailDrawer(false);
  };

  console.log(vehicleList);

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
            focus="true"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập id thẻ!",
              },
            ]}
          >
            <Input Input ref={idCardRef} placeholder="Nhập id thẻ" />
          </Form.Item>

          <Form.Item
            label="Loại thẻ"
            name="role"
            initialValue={"Default"}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại thẻ!",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn loại thẻ"
              onChange={(value) => setShowExtraFields(value === "Client")}
            >
              <Select.Option value={"Default"}>Thẻ thường</Select.Option>
              <Select.Option value={"Client"}>Thẻ tháng</Select.Option>
            </Select>
          </Form.Item>
          {showExtraFields && (
            <>
              <Form.Item
                label="Khách hàng"
                name="user"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn khách hàng!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Chọn khách hàng"
                  options={dataUser.map((user) => ({
                    value: user._id,
                    label: user.full_name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Ngày bắt đầu"
                name="start_date"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày bắt đầu!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Ngày hết hạn"
                name="end_date"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày hết hạn!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Giá thẻ tháng"
                name="card_fee"
                focus="true"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá thẻ tháng",
                  },
                ]}
              >
                <Input Input placeholder="Nhập giá thẻ tháng!" />
              </Form.Item>
            </>
          )}

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
              <Select.Option value="Normal">Thẻ thường</Select.Option>
              <Select.Option value="Client">Thẻ tháng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item></Form.Item>
          <Form.Item
            label="Chọn khách hàng"
            name="user"
            initialValue={currentRecord?.user_card?._id} // Lấy _id của user làm giá trị ban đầu
            rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
          >
            <Select
              placeholder="Chọn khách hàng"
              showSearch
              loading={loadingUser}
              optionFilterProp="children" // Cho phép lọc trong dropdown
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {dataUser &&
                dataUser.map((user) => (
                  <Select.Option key={user._id} value={user._id}>
                    {user.full_name}
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
        title="Chi tiết thẻ"
        width={400}
        onClose={closeCarDetailDrawer}
        visible={onOpenCardDetailDrawer}
        // footer={null}
        // bodyStyle={{ padding: 20 }}
        // style={{ maxHeight: "80vh" }}
      >
        <Descriptions
          bordered
          column={1}
          size="mall"
          labelStyle={{ fontWeight: "bold" }}
        >
          <Descriptions.Item label="Id thẻ">
            {currentRecord?.id_card || "rỗng"}
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

          <Descriptions.Item label="Giấy phép">
            {currentRecord?.vehicle && currentRecord.vehicle.length > 0 ? (
              currentRecord.vehicle.map((v) => <span>{v.license_name}</span>)
            ) : (
              <Typography.Text type="secondary">rỗng</Typography.Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Phương tiện">
            {currentRecord?.vehicle && currentRecord.vehicle.length > 0 ? (
              currentRecord.vehicle.map((v) =>
                currentRecord.vehicle.map((v) => <span>{v.vehicle_type}</span>)
              )
            ) : (
              <Typography.Text type="secondary">rỗng</Typography.Text>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Người sử dụng">
            {currentRecord?.user_card?.full_name || "rỗng"}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag
              color={currentRecord?.status === "Using" ? "green" : "volcano"}
            >
              {currentRecord?.status === "Using" ? "Đang sử dụng" : "Đang chờ"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Loại thẻ">
            {currentRecord?.role === "Client" ? "Thẻ tháng" : "Thẻ thường"}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian vào">
            {currentRecord?.entrance_time}
          </Descriptions.Item>

          <Descriptions.Item label="Ảnh phương tiện">
            <div>
              <img src={currentRecord?.vehicle_img}/>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Ảnh khuôn mặt">
          <div>
              <img src={currentRecord?.user_img}/>
            </div>
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
