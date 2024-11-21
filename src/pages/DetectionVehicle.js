import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Space,
  Row,
  Col,
  Card,
  Title,
  Typography,
  Descriptions,
} from "antd";
import { CameraOutlined, PoweroffOutlined } from "@ant-design/icons";
import ServiceParkingCard from "../service/ServiceParkingCard";
import axios from "axios";
const DetectionVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cardId, setCardId] = useState("");
  const [dataEntry, setDataEntry] = useState("");
  const [dataExit, setDataExit] = useState("");
  const [capturedPlateIn, setCapturedPlateIn] = useState(null);
  const [capturedFaceIn, setCapturedFaceIn] = useState(null);
  const [capturedPlate, setCapturedPlate] = useState(null);
  const [capturedFace, setCapturedFace] = useState(null);
  const [form] = Form.useForm();
  const plateVideoRef = useRef(null);
  const faceVideoRef = useRef(null);
  const plateCanvasRef = useRef(null);
  const faceCanvasRef = useRef(null);
  const cardIdInputRef = useRef(null);
  const { Title } = Typography;
  useEffect(() => {
    // Auto-focus on the Card ID input field when component mounts
    if (cardIdInputRef.current) {
      cardIdInputRef.current.focus();
    }
  }, []);

  // Function to start the camera
  const startCamera = async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (type === "plate" && plateVideoRef.current) {
        plateVideoRef.current.srcObject = stream;
      } else if (type === "face" && faceVideoRef.current) {
        faceVideoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch (error) {
      message.error("Could not access camera");
    }
  };

  // Function to stop the camera
  const stopCamera = (type) => {
    let stream = null;
    if (type === "plate" && plateVideoRef.current) {
      stream = plateVideoRef.current.srcObject;
    } else if (type === "face" && faceVideoRef.current) {
      stream = faceVideoRef.current.srcObject;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (type === "plate") {
        plateVideoRef.current.srcObject = null;
      } else if (type === "face") {
        faceVideoRef.current.srcObject = null;
      }
    }
    setCameraOn(false);
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    if (cameraOn) {
      stopCamera("plate");
      stopCamera("face");
    } else {
      startCamera("plate");
      startCamera("face");
    }
  };

  // Capture image from video stream
  const captureImage = (type) => {
    const canvas =
      type === "plate" ? plateCanvasRef.current : faceCanvasRef.current;
    const video =
      type === "plate" ? plateVideoRef.current : faceVideoRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    if (type === "plate") {
      setCapturedPlate(imageData);
    } else {
      setCapturedFace(imageData);
    }
    return imageData;
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!cameraOn) {
      message.error("Vui lòng bật camera trước khi xác nhận.");
      setLoading(false);
      return;
    }

    const plateImageData = captureImage("plate");
    const faceImageData = captureImage("face");

    if (!plateImageData || !faceImageData || !cardId) {
      message.error("Không tìm thấy thẻ hoặc ảnh từ camera.");
      setLoading(false);
      return;
    }

    const plateBlob = await (await fetch(plateImageData)).blob();
    const faceBlob = await (await fetch(faceImageData)).blob();
    const formData = new FormData();
    formData.append("id_card", cardId);
    formData.append("entrance_time", new Date().toISOString());
    formData.append(
      "plate_file",
      new File([plateBlob], "plate.png", { type: "image/png" })
    );
    formData.append(
      "face_file",
      new File([faceBlob], "face.png", { type: "image/png" })
    );

    // Kiểm tra FormData trước khi gửi
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/card/detect`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data && response.data.detail.msg === "Entry Successfully") {
        setDataEntry(response.data.detail.data);
        setDataExit("");
        message.success("Gửi xe thành công!");
        form.resetFields();
        cardIdInputRef.current.focus();
      } else if (
        response.data &&
        response.data.detail.msg === "Exited Successfully"
      ) {
        setDataExit(response.data.detail.data);
        setDataEntry("");
        message.success("Lấy xe thành công!");
        form.resetFields();
        cardIdInputRef.current.focus();
      } else {
        message.error("Đã xảy ra lỗi!");
      }
    } catch (error) {
      console.log(error.message);
      message.error("Đã xảy ra lỗi!");
      form.resetFields();
      cardIdInputRef.current.focus();
    } finally {
      setLoading(false);
      form.resetFields();
      cardIdInputRef.current.focus();
    }
  };

  return (
    <div>
      <Row gutter={[24, 0]}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card
            bordered={false}
            className="criclebox h-full"
            style={{ textAlign: "center" }}
            // title="Theo dõi phương tiện"
          >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Form.Item
                label="Thẻ"
                name="id_card"
                rules={[{ required: true, message: "Vui lòng nhập id thẻ" }]}
              >
                <Input
                  placeholder="Quét hoặc nhập id thẻ"
                  ref={cardIdInputRef}
                  onChange={(e) => setCardId(e.target.value)}
                />
              </Form.Item>
              <Space>
                <Form.Item label="Camera biển số">
                  <video
                    ref={plateVideoRef}
                    autoPlay
                    style={{ width: "300px", borderRadius: "8px" }}
                  />
                  <canvas
                    ref={plateCanvasRef}
                    style={{ display: "none" }}
                    width="640"
                    height="480"
                  />
                </Form.Item>
                <Form.Item label="Camera khuôn mặt">
                  <video
                    ref={faceVideoRef}
                    autoPlay
                    style={{ width: "300px", borderRadius: "8px" }}
                  />
                  <canvas
                    ref={faceCanvasRef}
                    style={{ display: "none" }}
                    width="640"
                    height="480"
                  />
                </Form.Item>
              </Space>
              <Space>
                {capturedPlateIn && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h3>Biển số</h3>
                    <img
                      src={capturedPlateIn}
                      alt="Captured"
                      style={{ maxWidth: "100%", maxHeight: "400px" }}
                    />
                  </div>
                )}
                {capturedFaceIn && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h3>Khuôn mặt</h3>
                    <img
                      src={capturedFaceIn}
                      alt="Captured"
                      style={{ maxWidth: "100%", maxHeight: "400px" }}
                    />
                  </div>
                )}
              </Space>
            </Form>
            <Card
              className="criclebox h-full uppercase"
              style={{ textAlign: "center", marginBottom: "16px" }} // Thêm khoảng cách giữa các Card
              // title="Xe vào bãi"
            >
              <Descriptions
                bordered
                column={1}
                size="mall"
                labelStyle={{ fontWeight: "bold" }}
              >
                <Descriptions.Item label="Khách hàng">
                  {dataEntry?.user_card || "Đang chờ"}
                </Descriptions.Item>
                <Descriptions.Item label="Phương tiện vào">
                  {dataEntry?.vehicle_plate || "Đang chờ"}
                </Descriptions.Item>

                <Descriptions.Item label="Thời gian vào">
                  {dataEntry?.entrance_time &&
                  !isNaN(new Date(dataEntry?.entrance_time).getTime())
                    ? new Date(dataEntry?.entrance_time).toLocaleString()
                    : "00:00"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* Card 2: Xe ra bãi */}
          <Card
            bordered={false}
            className="criclebox h-full"
            style={{ textAlign: "center" }}
            // title="Theo dõi phương tiện"
          >
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Form.Item
                label="Thẻ"
                name="id_card"
                rules={[{ required: true, message: "Vui lòng nhập id thẻ" }]}
              >
                <Input
                  placeholder="Quét hoặc nhập id thẻ"
                  ref={cardIdInputRef}
                  onChange={(e) => setCardId(e.target.value)}
                />
              </Form.Item>
              <Space>
                <Form.Item label="Camera biển số">
                  <video
                    ref={plateVideoRef}
                    autoPlay
                    style={{ width: "300px", borderRadius: "8px" }}
                  />
                  <canvas
                    ref={plateCanvasRef}
                    style={{ display: "none" }}
                    width="640"
                    height="480"
                  />
                </Form.Item>
                <Form.Item label="Camera khuôn mặt">
                  <video
                    ref={faceVideoRef}
                    autoPlay
                    style={{ width: "300px", borderRadius: "8px" }}
                  />
                  <canvas
                    ref={faceCanvasRef}
                    style={{ display: "none" }}
                    width="640"
                    height="480"
                  />
                </Form.Item>
              </Space>
              <Space>
                {capturedPlate && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h3>Biển số</h3>
                    <img
                      src={capturedPlate}
                      alt="Captured"
                      style={{ maxWidth: "100%", maxHeight: "400px" }}
                    />
                  </div>
                )}
                {capturedFace && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h3>Khuôn mặt</h3>
                    <img
                      src={capturedFace}
                      alt="Captured"
                      style={{ maxWidth: "100%", maxHeight: "400px" }}
                    />
                  </div>
                )}
              </Space>
            </Form>
            <Card
              className="criclebox h-full uppercase"
              style={{ textAlign: "center" }}
              // title="Xe ra bãi"
            >
              <Card>
                <Space>
                  <Descriptions
                    bordered
                    column={1}
                    size="mall"
                    labelStyle={{ fontWeight: "bold" }}
                  >
                    <Descriptions.Item label="Thời gian vào">
                      {dataExit?.entrance_time &&
                      !isNaN(new Date(dataExit?.entrance_time).getTime())
                        ? new Date(dataExit?.entrance_time).toLocaleString()
                        : "00:00"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương tiện vào">
                      {dataExit?.vehicle_plate || "Đang chờ"}
                    </Descriptions.Item>
                  </Descriptions>
                </Space>
                <Space>
                  <Descriptions
                    bordered
                    column={1}
                    size="mall"
                    labelStyle={{ fontWeight: "bold" }}
                  >
                    <Descriptions.Item label="Thời gian ra">
                      {dataExit?.entrance_time &&
                      !isNaN(new Date(dataExit?.entrance_time).getTime())
                        ? new Date(dataExit?.entrance_time).toLocaleString()
                        : "00:00"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương tiện ra">
                      {dataExit?.vehicle_plate || "Đang chờ"}
                    </Descriptions.Item>
                  </Descriptions>
                </Space>
              </Card>
              <Card>
                <Space>
                  <Descriptions>
                    <Descriptions.Item label="Phí">
                      <Typography.Text
                        type="secondary"
                        style={{ color: "#d63031", fontSize: "20px" }}
                      >
                        {" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(dataExit?.fee || 0)}
                      </Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Space>
              </Card>
            </Card>
          </Card>
        </Col>
      </Row>
      {/* Hiển thị ảnh đã chụp */}

      <Space
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          type="default"
          icon={<PoweroffOutlined />}
          onClick={() => {
            toggleCamera("plate");
            toggleCamera("face");
          }}
          block
        >
          {cameraOn ? "Tắt camera" : "Bật camera"}
        </Button>

        <Button
          type="primary"
          icon={<CameraOutlined />}
          loading={loading}
          onClick={handleSubmit}
          block
        >
          Xác nhận
        </Button>
      </Space>
    </div>
  );
};

export default DetectionVehicle;
