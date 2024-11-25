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

import ServiceParkingCard from "../service/ServiceParkingCard";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import moment from "moment";

const DetectionVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [dataEntry, setDataEntry] = useState("");
  const [dataExit, setDataExit] = useState("");
  const [capturedPlate, setCapturedPlate] = useState(null);
  const [capturedFace, setCapturedFace] = useState(null);
  const [capturedPlateIn, setCapturedPlateIn] = useState(null);
  const [capturedFaceIn, setCapturedFaceIn] = useState(null);

  const plateInVideoRef = useRef(null);
  const faceInVideoRef = useRef(null);
  const plateVideoRef = useRef(null);
  const faceVideoRef = useRef(null);

  const plateInCanvasRef = useRef(null);
  const faceInCanvasRef = useRef(null);
  const plateCanvasRef = useRef(null);
  const faceCanvasRef = useRef(null);

  const [form] = Form.useForm();

  useEffect(() => {
    cloudinary.config({
      cloud_name: process.env.REACT_APP_CLOUD_NAME,
      api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
      api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
    });

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (plateInVideoRef.current) plateInVideoRef.current.srcObject = stream;
        if (faceInVideoRef.current) faceInVideoRef.current.srcObject = stream;
        if (plateVideoRef.current) plateVideoRef.current.srcObject = stream;
        if (faceVideoRef.current) faceVideoRef.current.srcObject = stream;
      } catch (error) {
        message.error("Không thể truy cập camera.");
      }
    };

    startCamera();

    return () => {
      const stopCamera = () => {
        const streams = [
          plateInVideoRef.current?.srcObject,
          faceInVideoRef.current?.srcObject,
          plateVideoRef.current?.srcObject,
          faceVideoRef.current?.srcObject,
        ];
        streams.forEach((stream) =>
          stream?.getTracks().forEach((track) => track.stop())
        );
      };
      stopCamera();
    };
  }, []);

  useEffect(() => {
    let buffer = ""; // Bộ đệm để lưu dãy số thẻ

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        // Khi Enter được nhấn, xử lý dãy số
        if (buffer) {
          handleSubmit(buffer); // Gọi hàm xử lý thẻ
          buffer = ""; // Reset bộ đệm
        }
      } else {
        // Thêm ký tự vào bộ đệm nếu là số
        if (!isNaN(event.key)) {
          buffer += event.key;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "", time: "" };

    const [date, time] = dateTimeString.split(" ");
    return { date, time };
  };

  // Capture image from video stream
  const captureImagePlate = (plateCanvasRef) => {
    const plateCanvas = plateCanvasRef.current;
    const plateContext = plateCanvas.getContext("2d");
    plateContext.drawImage(
      plateVideoRef.current,
      0,
      0,
      plateCanvas.width,
      plateCanvas.height
    );
    const imageData = plateCanvas.toDataURL("image/png");
    setCapturedPlate(imageData); // Lưu ảnh vào state
    return imageData;
  };
  // Capture image from video stream
  const captureImageFace = (faceCanvasRef) => {
    const faceCanvas = faceCanvasRef.current;
    const faceContext = faceCanvas.getContext("2d");
    faceContext.drawImage(
      faceVideoRef.current,
      0,
      0,
      faceCanvas.width,
      faceCanvas.height
    );
    const imageData = faceCanvas.toDataURL("image/png");
    setCapturedFace(imageData); // Lưu ảnh vào state
    return imageData;
  };

  const uploadToCloudinary = async (imageData, folder) => {
    const blob = await (await fetch(imageData)).blob();

    const formData = new FormData();

    // Tạo một tên file duy nhất bằng cách thêm timestamp
    const uniqueName = `vehicle_${Date.now()}.png`; // Đảm bảo tên ảnh là duy nhất mỗi lần upload

    formData.append(
      "file",
      new File([blob], uniqueName, { type: "image/png" })
    );
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", folder);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url; // Trả về URL ảnh đã upload
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Upload to Cloudinary failed");
    }
  };

  const handleSubmit = async (cardId) => {
    message.info(cardId);

    setLoading(true);

    const checkCardRes = await ServiceParkingCard.getParkingCard(cardId);

    //Kiểm tra trạng thái thẻ
    if (checkCardRes.status === "Not Use") {
      const plateImageData = captureImagePlate(plateInCanvasRef);
      const faceImageData = captureImageFace(faceInCanvasRef);
      setCapturedPlateIn(plateImageData);
      setCapturedFaceIn(faceImageData);

      if (!plateImageData || !faceImageData) {
        message.error("Không chụp được ảnh");
        setLoading(false);
        return;
      }
      if (!cardId) {
        message.error("Không tìm thấy id thẻ");
        setLoading(false);
        return;
      }
      try {
        // Convert images to Blob
        const plateBlob = await (await fetch(plateImageData)).blob();
        const plateUrl = await uploadToCloudinary(plateImageData, "parking");
        const faceUrl = await uploadToCloudinary(faceImageData, "parking");

        const file_data = new File([plateBlob], "capture.png", {
          type: "image/png",
        });
        const formattedTime = moment(new Date().toISOString()).format(
          "DD/MM/YYYY HH:mm:ss"
        );
        const formData = {
          id_card: cardId,
          entrance_time: formattedTime,
          vehicle_img: plateUrl,
          user_img: faceUrl,
          file: file_data,
        };
        const response = await axios.put(
          `${process.env.REACT_APP_API}/card/entry`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (
          response.data &&
          response.data.detail.msg === "Entry Successfully"
        ) {
          setDataEntry(response.data.detail.data);
          setDataExit("");
          message.success("Gửi xe thành công!");
          form.resetFields();
        } else {
          message.error("Đã xảy ra lỗi!");
        }
      } catch (error) {
        console.error("Error uploading or sending data:", error);
        message.error("Đã xảy ra lỗi!");
      } finally {
        setLoading(false);
        form.resetFields();
      }
    } else {
      const plateImageData = captureImagePlate(plateCanvasRef);
      const faceImageData = captureImageFace(faceCanvasRef);
      setCapturedPlate(plateImageData);
      setCapturedFace(faceImageData);

      if (!plateImageData || !faceImageData || !cardId) {
        message.error("Không tìm thấy thẻ hoặc ảnh từ camera.");
        setLoading(false);
        return;
      }

      try {
        // Convert images to Blob
        const plateBlob = await (await fetch(plateImageData)).blob();
        const plateUrl = await uploadToCloudinary(plateImageData, "parking");
        const faceUrl = await uploadToCloudinary(faceImageData, "parking");

        const file_data = new File([plateBlob], "capture.png", {
          type: "image/png",
        });

        const formattedTime = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
        const formData = {
          id_card: cardId,
          exit_time: formattedTime,
          vehicle_img: plateUrl,
          user_img: faceUrl,
          file: file_data,
        };

        const response = await axios.put(
          `${process.env.REACT_APP_API}/card/exit`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);

        if (
          response.data &&
          response.data.detail.msg === "Exited Successfully"
        ) {
          setDataExit(response.data.detail.data);
          setDataEntry("");
          message.success("Lấy xe thành công!");
          form.resetFields();
        } else {
          message.error("Đã xảy ra lỗi!");
        }
      } catch (error) {
        console.log(error.message);
        message.error("Đã xảy ra lỗi!");
        form.resetFields();
      } finally {
        setLoading(false);
        form.resetFields();
      }
    }
  };

  const { date: dateIn, time: timeIn } = formatDateTime(
    dataExit?.entrance_time
  );
  const { date: dateEntranceOut, time: EntranceOut } = formatDateTime(
    dataExit?.entrance_time
  );
  const { date: dateOut, time: timeOut } = formatDateTime(dataExit?.exit_time);

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
              <Space>
                <Form.Item label="Camera biển số (Xe vào)">
                  <video
                    ref={plateInVideoRef}
                    autoPlay
                    style={{ width: "300px", borderRadius: "8px" }}
                  />
                  <canvas
                    ref={plateInCanvasRef}
                    style={{ display: "none" }}
                    width="640"
                    height="480"
                  />
                </Form.Item>
                <Form.Item label="Camera khuôn mặt (Xe vào)">
                  <video
                    ref={faceInVideoRef}
                    autoPlay
                    style={{ width: "300px", borderRadius: "8px" }}
                  />
                  <canvas
                    ref={faceInCanvasRef}
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
                      style={{ width: "300px", height: "200px" }}
                    />
                  </div>
                )}
                {capturedFaceIn && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h3>Khuôn mặt</h3>
                    <img
                      src={capturedFaceIn}
                      alt="Captured"
                      style={{ width: "300px", height: "200px" }}
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
                <Descriptions.Item label="Ngày vào">{dateIn}</Descriptions.Item>
                <Descriptions.Item label="Giờ vào">{timeIn}</Descriptions.Item>
                <Descriptions.Item label="Phương tiện vào">
                  {dataEntry?.vehicle_plate || "Đang chờ"}
                </Descriptions.Item>
              </Descriptions>
              <Card>
                <Descriptions>
                  <Descriptions.Item
                    label="Ảnh biển số"
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    <div
                      style={{
                        maxHeight: "150px",
                        maxWidth: "150px",
                      }}
                    >
                      <img src={dataEntry?.vehicle_img} />
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
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
                      style={{ width: "300px", height: "200px" }}
                    />
                  </div>
                )}
                {capturedFace && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h3>Khuôn mặt</h3>
                    <img
                      src={capturedFace}
                      alt="Captured"
                      style={{ width: "300px", height: "200px" }}
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
              <Space>
                <Descriptions
                  bordered
                  column={1}
                  size="mall"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  <Descriptions.Item label="Ngày vào">
                    {dateEntranceOut}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giờ vào">
                    {EntranceOut}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương tiện vào">
                    {dataExit?.vehicle_plate_entry || "Đang chờ"}
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
                  <Descriptions.Item label="Ngày ra">
                    {dateOut}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giờ">
                    {timeOut}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương tiện ra">
                    {dataExit?.vehicle_plate_exit || "Đang chờ"}
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Card>
            <Card>
              <Space>
                <div>
                  {" "}
                  <Descriptions
                    bordered
                    column={1}
                    size="mall"
                    labelStyle={{ fontWeight: "bold" }}
                  >
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
                        }).format(dataExit?.fee || 0)}
                      </Typography.Text>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
                <Descriptions
                  bordered
                  column={1}
                  size="mall"
                  labelStyle={{ fontWeight: "bold" }}
                >
                  <Descriptions.Item label="Ảnh biển số">
                    <div
                      style={{
                        maxHeight: "150px",
                        maxWidth: "150px",
                      }}
                    >
                      <img src={dataExit?.vehicle_img} />
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetectionVehicle;
