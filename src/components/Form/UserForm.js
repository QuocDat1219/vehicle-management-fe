import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space } from "antd";

const UserForm = ({ form, handleGetUser, loadingUserName, dataDevice, setUserName, handleSelectDeviceType, loadingDevice, dataIp, loadingIp, dataVlanNet, vlanNetOneDevice, loadingVlanNet, dataVlanMyTV, loadingVlanMyTV, dataVlanIMS, loadingVlanIMS }) => (
    <>
        <Space direction="vertical">
            <Input placeholder="Tài khoản" onChange={(value) => setUserName(value.target.value)} prefix={<UserOutlined />} />
            <Button style={{ width: "100%" }} onClick={handleGetUser} loading={loadingUserName} ghost type="primary" icon={<SearchOutlined />}>Tìm dữ liệu</Button>
        </Space>
        <Form
            form={form}

            initialValues={{ size: "small" }}
            layout="vertical"
            size={"small"}
            className="form-card"
            style={{ marginTop: 10 }}
        >
            <Form.Item
                label="Loại thiết bị"
                className="select-item"
                name="deviceType"
                style={{ marginBottom: 10 }}
                rules={[
                    {
                        required: true,
                        message: "Vui lòng chọn loại thiết bị",
                    },
                ]}
            >
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn loại thiết bị"
                    onChange={handleSelectDeviceType}
                >
                    <Select.Option value="GPON ALU">GPON ALU</Select.Option>
                    <Select.Option value="GPON HW">GPON HW</Select.Option>
                    <Select.Option value="GPON MINI HW">GPON Mini HW</Select.Option>
                    <Select.Option value="GPON MINI ZTE">
                        GPON Mini ZTE
                    </Select.Option>
                    <Select.Option value="GPON ZTE">GPON ZTE</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Thiết bị"
                className="select-item"
                name="deviceName"
                style={{ marginBottom: 10 }}
                rules={[
                    { required: true, message: "Vui lòng chọn thiết bị" },
                ]}
            >
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn thiết bị"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    loading={loadingDevice}
                >
                    {dataDevice.map((device) => (
                        <Select.Option key={device._id} value={device._id}>
                            {device.tenthietbi}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Ip"
                name="ipaddress"
                className="select-item"
                style={{ marginBottom: 10 }}
                rules={[{ required: true, message: "Vui lòng chọn Ip" }]}
            >
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn Ip"
                    loading={loadingIp}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                >
                    {dataIp?.map((item, i) => (
                        <Select.Option key={item._id} value={item._id}>
                            {item.ipaddress}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Vlan Net"
                name="vlannet"
                className="select-item"
                style={{ marginBottom: 10 }}
                rules={[
                    { required: true, message: "Vui lòng chọn Vlan Net" },
                ]}
            >
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan Net"
                    loading={loadingVlanNet}
                >
                    {vlanNetOneDevice?.map((item, i) => (
                        <Select.Option key={item._id} value={item._id}>
                            {item.number}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                label="Vlan Mytv"
                name="vlanmytv"
                className="select-item"
                style={{ marginBottom: 10 }}
                rules={[
                    { required: true, message: "Vui lòng chọn Vlan Mytv" },
                ]}
            >
                <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn Vlan Mytv"
                    loading={loadingVlanMyTV}
                    disabled
                >
                    {dataVlanMyTV?.map((item, i) => (
                        <Select.Option key={item._id} value={item._id}>
                            {item.number}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Vlan IMS"
                name="vlanims"
                className="select-item"
                style={{ marginBottom: 10 }}
                loading={loadingVlanIMS}
                rules={[
                    { required: true, message: "Vui lòng chọn Vlan IMS" },
                ]}

            >
                <Select placeholder="Chọn Vlan IMS" disabled>
                    {dataVlanIMS?.map((item, i) => (
                        <Select.Option key={item._id} value={item._id}>
                            {item.number}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    </>
);

export default UserForm