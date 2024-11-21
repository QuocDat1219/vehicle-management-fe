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
  Typography,
  Descriptions,
} from "antd";
import { CameraOutlined, PoweroffOutlined } from "@ant-design/icons";
import axios from "axios";

const DetectionVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cardId, setCardId] = useState("");
  const [capturedImages, setCapturedImages] = useState({
    camera1: null,
    camera2: null,
    camera3: null,
    camera4: null,
  });
  const [form] = Form.useForm();
  const cardIdInputRef = useRef(null);

  const videoRefs = useRef({
    camera1: null,
    camera2: null,
    camera3: null,
    camera4: null,
  });
  const canvasRefs = useRef({
    camera1: null,
    camera2: null,
    camera3: null,
    camera4: null,
  });

  useEffect(() => {
    if (cardIdInputRef.current) {
      cardIdInputRef.current.focus();
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      Object.keys(videoRefs.current).forEach((key) => {
        if (videoRefs.current[key]) {
          videoRefs.current[key].srcObject = stream;
        }
      });
      setCameraOn(true);
    } catch (error) {
      message.error("Không thể truy cập camera.");
    }
  };

  const stopCamera = () => {
    Object.keys(videoRefs.current).forEach((key) => {
      const video = videoRefs.current[key];
      if (video && video.srcObject) {
        const stream = video.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    });
    setCameraOn(false);
  };

  const toggleCamera = () => {
    if (cameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const captureImage = (cameraKey) => {
    const canvas = canvasRefs.current[cameraKey];
    const video = videoRefs.current[cameraKey];
    if (canvas && video) {
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/png");
      setCapturedImages((prev) => ({ ...prev, [cameraKey]: imageData }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!cameraOn) {
      message.error("Vui lòng bật camera trước khi xác nhận.");
      form.resetFields();
      cardIdInputRef.current.focus();
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("id_card", cardId);
    formData.append("entrance_time", new Date().toISOString());

    Object.entries(capturedImages).forEach(([key, imageData]) => {
      if (imageData) {
        const blob = new Blob([imageData], { type: "image/png" });
        formData.append(key, new File([blob], `${key}.png`, { type: "image/png" }));
      }
    });

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/card/detect`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      message.success("Dữ liệu đã được gửi thành công!");
    } catch (error) {
      console.error(error.message);
      message.error("Đã xảy ra lỗi!");
    } finally {
      setLoading(false);
      form.resetFields();
      cardIdInputRef.current.focus();
    }
  };

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card title="Quản lý camera và phương tiện">
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
              <Row gutter={[16, 16]}>
                {["camera1", "camera2", "camera3", "camera4"].map((key) => (
                  <Col xs={24} sm={12} md={12} lg={6} key={key}>
                    <Card title={`Camera ${key.slice(-1)}`}>
                      <video
                        ref={(el) => (videoRefs.current[key] = el)}
                        autoPlay
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <canvas
                        ref={(el) => (canvasRefs.current[key] = el)}
                        style={{ display: "none" }}
                        width="640"
                        height="480"
                      />
                      <Space direction="vertical" style={{ marginTop: "10px" }}>
                        <Button
                          type="primary"
                          icon={<CameraOutlined />}
                          onClick={() => captureImage(key)}
                          block
                        >
                          Chụp ảnh
                        </Button>
                        {capturedImages[key] && (
                          <img
                            src={capturedImages[key]}
                            alt={`Captured from ${key}`}
                            style={{ width: "100%", borderRadius: "8px" }}
                          />
                        )}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Space style={{ marginTop: "20px" }}>
                <Button
                  type="default"
                  icon={<PoweroffOutlined />}
                  onClick={toggleCamera}
                  block
                >
                  {cameraOn ? "Tắt camera" : "Bật camera"}
                </Button>
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  loading={loading}
                  htmlType="submit"
                  block
                >
                  Xác nhận
                </Button>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetectionVehicle;
