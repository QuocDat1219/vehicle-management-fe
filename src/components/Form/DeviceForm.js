import { Form, Select } from "antd";

const DeviceForm = ({ form, deviceType, setDeviceType, devices, loadingDevices, setSelectDevices, dataIp, loadingIp, dataVlanNet, vlanNetOneDevice, loadingVlanNet, dataVlanMyTV, loadingVlanMyTV, dataVlanIMS, loadingVlanIMS, setIpAddress }) => (
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
                onChange={(value) => setDeviceType(value)}
                placeholder="Chọn loại thiết bị"
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
                onChange={(value) => setSelectDevices(value)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                }
                loading={loadingDevices}
            >
                {devices.map((device) => (
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
                onChange={(value) => setIpAddress(value)}
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
            loading={loadingVlanIMS}
            style={{ marginBottom: 10 }}
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
);

export default DeviceForm;