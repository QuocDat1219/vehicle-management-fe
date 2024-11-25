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
  Descriptions,
  Typography,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import useAsync from "../hook/useAsync";
import moment from "moment-timezone";
import ServiceHistory from "./../service/ServiceHistory";

const History = () => {
  const [form] = useForm();
  const [form2] = useForm();
  const [form3] = useForm();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  const [onOpenCardDetailDrawer, setOpenCardDetailDrawer] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [data, setData] = useState([]);

  //Load dữ liệu giá
  const { data: dataHistory, loading: loadingHistory } = useAsync(() =>
    ServiceHistory.getAllHistory()
  );
  useEffect(() => {
    setData(dataHistory);
  }, [dataHistory]);

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Mã thẻ",
      dataIndex: "parkingcard",
      key: "parkingcard",
      render: (parkingcard) => parkingcard?.id_card || "",
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (user) => user?.full_name || "",
    },
    {
      title: "Biển số xe",
      dataIndex: "vehicle",
      key: "number_plate",
      render: (vehicle) => vehicle?.number_plate || "Không xác định",
    },
    {
      title: "Loại vé",
      dataIndex: "parkingcard",
      key: "parkingcard",
      render: (parkingcard) =>
        parkingcard?.role === "Client" ? "Vé tháng" : "Vé thường",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={status === "In" ? "green" : "red"} key={status}>
          {status === "In" ? "Xe vào" : "Xe ra"}
        </Tag>
      ),
    },
    {
      title: "Chức năng",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => openCardDetailDrawer(record)}
            type="dashed"
            style={{ width: "100%", marginTop: "5px", marginBottom: "5px" }}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const openCardDetailDrawer = async (record) => {
    const res = await ServiceHistory.getHistory(record._id);
    if (res) {
      setCurrentRecord(res);
      setOpenCardDetailDrawer(true);
    }
  };

  const closeCarDetailDrawer = () => {
    setOpenCardDetailDrawer(false);
  };

  console.log(currentRecord);

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
            loading={loadingHistory}
            dataSource={data}
            columns={columns}
          />
        </Col>
      </Row>
      <Drawer
        title="Chi tiết lịch sử phương tiện"
        width={500}
        onClose={closeCarDetailDrawer}
        visible={onOpenCardDetailDrawer}
      >
        <Descriptions
          bordered
          column={1}
          size="small"
          labelStyle={{ fontWeight: "bold" }}
        >
          {/* ID thẻ */}
          <Descriptions.Item label="Id thẻ">
            {currentRecord?.parkingcard?.id_card || "rỗng"}
          </Descriptions.Item>

          {/* Thông tin phương tiện */}
          <Descriptions.Item label="Phương tiện">
            {currentRecord?.vehicle ? (
              <div>
                <Tag color="blue">{currentRecord.vehicle.number_plate}</Tag>
                <div>Loại: {currentRecord.vehicle.vehicle_type}</div>
              </div>
            ) : (
              <Typography.Text type="secondary">rỗng</Typography.Text>
            )}
          </Descriptions.Item>

          {/* Người sử dụng */}
          <Descriptions.Item label="Người sử dụng">
            {currentRecord?.user ? (
              <div>
                <div>{currentRecord.user.full_name}</div>
                <div>SĐT: {currentRecord.user.phone}</div>
              </div>
            ) : (
              <Typography.Text type="secondary">rỗng</Typography.Text>
            )}
          </Descriptions.Item>
          {/* Hình ảnh phương tiện khi vào */}
          <Descriptions.Item label="Ảnh phương tiện vào">
            <img
              src={currentRecord?.vehicle_img_in}
              alt="Phương tiện vào"
              style={{ maxWidth: "100%" }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Ảnh phương ra">
            <img
              src={currentRecord?.vehicle_img}
              alt="Phương tiện"
              style={{ maxWidth: "100%" }}
            />
          </Descriptions.Item>

          {/* Hình ảnh người dùng khi vào */}
          <Descriptions.Item label="Ảnh người dùng vào">
            <img
              src={currentRecord?.user_img_in}
              alt="Người dùng vào"
              style={{ maxWidth: "100%" }}
            />
          </Descriptions.Item>
          {/* Hình ảnh người dùng */}
          <Descriptions.Item label="Ảnh người dùng ra">
            <img
              src={currentRecord?.user_img}
              alt="Người dùng"
              style={{ maxWidth: "100%" }}
            />
          </Descriptions.Item>

          {/* Thời gian */}
          <Descriptions.Item label="Thời gian vào">
            {currentRecord?.entrance_time || "rỗng"}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian ra">
            {currentRecord?.exit_time || "rỗng"}
          </Descriptions.Item>

          {/* Phí */}
          <Descriptions.Item label="Phí">
            <Typography.Text
              type="secondary"
              style={{
                color: "#d63031",
                fontSize: "20px",
                textAlign: "center",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(currentRecord?.fee || 0)}
            </Typography.Text>
          </Descriptions.Item>

          {/* Trạng thái */}
          <Descriptions.Item label="Trạng thái">
            <Tag color={currentRecord?.status === "Out" ? "red" : "green"}>
              {currentRecord?.status === "Out" ? "Xe ra" : "Xe vào"}
            </Tag>
          </Descriptions.Item>

          {/* Loại thẻ */}
          <Descriptions.Item label="Loại thẻ">
            {currentRecord?.parkingcard?.role === "Client"
              ? "Thẻ tháng"
              : "Thẻ thường"}
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </div>
  );
};

export default History;
