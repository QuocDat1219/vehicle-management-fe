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
  TimePicker,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import useAsync from "../hook/useAsync";
import ServiceFee from "../service/ServiceFee";
import moment from "moment-timezone";

const Fee = () => {
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

  // Xử lý thêm giá
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const onFinish = async (values) => {
    const night_time_format = moment(values.night_time);
    const day_time_format = moment(values.day_time);
    setLoading(true);
    try {
      const data = {
        vehicle_type: values.vehicle_type,
        fee_normal: values.fee_normal,
        fee_night: values.fee_night,
        fee_day: values.fee_day,
        fee_surcharge: values.fee_surcharge,
        night_time: night_time_format.format("HH:mm:ss"),
        day_time: day_time_format.format("HH:mm:ss"),
      };

      const res = await ServiceFee.createFee(data);
      // Kiểm tra nếu response trả về có `detail` và `msg`
      if (
        res.detail &&
        res.detail.msg === "Phí của loại phương tiện này đã được tạo!"
      ) {
        message.error(res.detail.msg);
        setLoading(false);
        setOpenModal(false);
        form.resetFields();
      } else {
        message.success("Thêm giá mới thành công");
        setData(res.detail.data); // Cập nhật dữ liệu
        setLoading(false);
        setOpenModal(false);
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi thêm giá mới");
      setLoading(false);
    }
  };

  //Load dữ liệu giá
  const { data: dataFee, loading: loadingFee } = useAsync(() =>
    ServiceFee.getAllFee()
  );
  useEffect(() => {
    setData(dataFee);
  }, [dataFee]);

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
      render: (vehicle_type) => (
        <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
          {vehicle_type === "Car"
            ? "Xe ô tô (ô tô con)"
            : vehicle_type === "Motocycle"
            ? "Xe máy (Xe máy điện)"
            : "Phương tiện khác"}
        </div>
      ),
    },
    {
      title: "Giá thường",
      dataIndex: "fee_normal",
      key: "fee_normal",
      render: (fee_normal) => (
        <div>
          {fee_normal
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(fee_normal)
            : "0₫"}
        </div>
      ),
    },
    {
      title: "Giá đêm",
      dataIndex: "fee_night",
      key: "fee_night",
      render: (fee_night) => (
        <div>
          {fee_night
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(fee_night)
            : "0₫"}
        </div>
      ),
    },
    {
      title: "Giá ngày đêm",
      dataIndex: "fee_day",
      key: "fee_day",
      render: (fee_day) => (
        <div>
          {fee_day
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(fee_day)
            : "0₫"}
        </div>
      ),
    },
    {
      title: "Giá phụ thu",
      dataIndex: "fee_surcharge",
      key: "fee_surcharge",
      render: (fee_surcharge) => (
        <div>
          {fee_surcharge
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(fee_surcharge)
            : "0₫"}
        </div>
      ),
    },
    {
      title: "Giờ đêm bắt đầu",
      dataIndex: "night_time",
      key: "night_time",
      render: (night_time) => {
        return <div>{night_time}</div>;
      },
    },
    {
      title: "Giờ đêm kết thúc",
      dataIndex: "day_time",
      key: "day_time",
      render: (day_time) => {
        return <div>{day_time}</div>;
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
      const res = await ServiceFee.deleteFee(selectedRecord._id);
      if (res) {
        setData(res.detail.data);
        message.success("Xóa giá của phương tiện thành công");
        setIsModalVisible(false);
      }
    } catch (error) {
      console.log(error);
      message.error("Đã xảy ra lỗi khi xóa!");
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
  console.log(currentRecord);

  // Sửa thông tin
  const onFinish2 = async (values) => {
    const night_time_format = moment(values.night_time_new);
    const day_time_format = moment(values.day_time_new);
    setLoading(true);
    try {
      const data = {
        vehicle_type: values.vehicle_type,
        fee_normal: values.fee_normal,
        fee_night: values.fee_night,
        fee_day: values.fee_day,
        fee_surcharge: values.fee_surcharge,
        night_time: night_time_format.format("HH:mm:ss"),
        day_time: day_time_format.format("HH:mm:ss"),
      };

      const res = await ServiceFee.editFee(currentRecord._id, data);
      if (res) {
        message.success("Sửa thông tin thành công");
        setData(res.detail.data); // Cập nhật dữ liệu trong bảng
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
              Thêm phí mới
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Table
            pagination={{ pageSize: 6 }}
            loading={loadingFee}
            dataSource={data}
            columns={columns}
          />
        </Col>
      </Row>
      <Modal
        title="Thêm giá cho phương tiện mới"
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
          {/* Dòng đầu tiên: Loại phương tiện */}
          <Row gutter={[24, 24]}>
            <Col span={24}>
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
                <Select placeholder="Chọn loại phương tiện">
                  <Select.Option value={"Car"}>
                    Xe ô tô (Ô tô con)
                  </Select.Option>
                  <Select.Option value={"Motocycle"}>
                    Xe máy (Xe máy điện)
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Dòng thứ hai: Giá thường và Giá đêm */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Giá thường"
                name="fee_normal"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá thường!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá thường" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá đêm"
                name="fee_night"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá buổi đêm!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá buổi đêm" />
              </Form.Item>
            </Col>
          </Row>

          {/* Dòng thứ ba: Giá ngày đêm và Giá phụ thu */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Giá ngày đêm"
                name="fee_day"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá ngày đêm!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá ngày đêm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá phụ thu"
                name="fee_surcharge"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá phụ thu!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá phụ thu" />
              </Form.Item>
            </Col>
          </Row>

          {/* Dòng thứ tư: Thời gian tính đêm */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Thời gian bắt đầu tính đêm"
                name="night_time"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian bắt đầu tính đêm!",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm:ss"
                  placeholder="Chọn thời gian bắt đầu tính đêm"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Thời gian kết thúc tính đêm"
                name="day_time"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian kết thúc tính đêm!",
                  },
                ]}
              >
                <TimePicker
                  format="HH:mm:ss"
                  placeholder="Chọn thời gian kết thúc tính đêm"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Nút thêm */}
          <Row>
            <Col span={24}>
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
            </Col>
          </Row>
        </Form>
      </Modal>

      <Drawer
        title="Sửa thông tin giá"
        width={400}
        onClose={closeDrawer}
        visible={openDrawer}
        footer={null}
      >
        <Form form={form2} onFinish={onFinish2} layout="vertical">
          {/* Dòng đầu tiên: Loại phương tiện */}
          <Row gutter={[24, 24]}>
            <Col span={24}>
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
                <Select placeholder="Chọn loại phương tiện">
                  <Select.Option value={"Car"}>
                    Xe ô tô (Ô tô con)
                  </Select.Option>
                  <Select.Option value={"Motocycle"}>
                    Xe máy (Xe máy điện)
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Dòng thứ hai: Giá thường và Giá đêm */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Giá thường"
                name="fee_normal"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá thường!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá thường" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá đêm"
                name="fee_night"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá buổi đêm!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá buổi đêm" />
              </Form.Item>
            </Col>
          </Row>

          {/* Dòng thứ ba: Giá ngày đêm và Giá phụ thu */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Giá ngày đêm"
                name="fee_day"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá ngày đêm!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá ngày đêm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá phụ thu"
                name="fee_surcharge"
                rules={[
                  {
                    required: true,
                    message: "Nhập giá phụ thu!",
                  },
                ]}
              >
                <Input type="number" placeholder="Nhập giá phụ thu" />
              </Form.Item>
            </Col>
          </Row>

          {/* Dòng thứ tư: Thời gian tính đêm */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Giờ đêm bắt đầu">
                <Tag color="blue">{currentRecord?.night_time}</Tag>
                <Form.Item
                  name="night_time_new"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giờ bắt đầu tính đêm!",
                    },
                  ]}
                >
                  <TimePicker
                    format="HH:mm:ss"
                    placeholder="Chọn giờ bắt đầu tính đêm"
                  />
                </Form.Item>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Giờ đêm kết thúc">
                <Tag color="blue">{currentRecord?.day_time}</Tag>
                <Form.Item
                  name="day_time_new"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giờ kết thúc tính đêm!",
                    },
                  ]}
                >
                  <TimePicker
                    format="HH:mm:ss"
                    placeholder="Chọn giờ kết thúc tính đêm"
                  />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>

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
        title="Xác nhận xóa giá phương tiện"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa giá của{" "}
          <b>{selectedRecord?.vehicle_type}</b> không?
        </p>
      </Modal>
    </div>
  );
};

export default Fee;
