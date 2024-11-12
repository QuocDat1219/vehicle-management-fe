import { Card, Form, InputNumber, Input } from "antd";

const DetailsForm = ({ form2, deviceType, radioValue }) => (

    <Form

        initialValues={{
            size: "small",
        }}
        layout="vertical"
        size={"small"}
        className="form-card"
        form={form2}

    >
        <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Card" name="card" className="select-item" >
            <InputNumber placeholder="Nhập Card" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Port" name="port" className="select-item">
            <InputNumber placeholder="Nhập Port" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 10, width: "100%" }} label="Onu ID" name="onuId" className="select-item">
            <InputNumber placeholder="Nhập Onu ID" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 10 }} label="SL ID" name="slId" className="select-item">
            <Input placeholder="Nhập SL ID" />
        </Form.Item>
        {deviceType === "GPON HW" && radioValue === "create_dvnet" &&
            <>
                <Form.Item label="Port Vlan Net" name="portvlannet" className="select-item" rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập Port Vlan Net",
                    },
                ]}>
                    <InputNumber placeholder="Nhập Port Vlan Net" />
                </Form.Item>
                <Form.Item label="Port GNMS" name="portgnms" className="select-item" rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập Port GNMS",
                    },
                ]}>
                    <InputNumber placeholder="Nhập Port GNMS" />
                </Form.Item>
            </>

        }
        {deviceType === "GPON HW" && radioValue === "dv_ims" &&
            <>
                <Form.Item label="Port IMS" name="portims" className="select-item" rules={[
                    {
                        required: true,
                        message: "Vui lòng nhập Port IMS",
                    },
                ]}>
                    <InputNumber placeholder="Nhập Port IMS" />
                </Form.Item>

            </>

        }
    </Form>

);

export default DetailsForm