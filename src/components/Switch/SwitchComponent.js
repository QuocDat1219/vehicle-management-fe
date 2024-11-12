import { Space, Switch } from "antd";
import Title from "antd/lib/typography/Title";

const SwitchComponent = ({ isChecked, handleSwitchChange }) => (
  <div>
    <Space direction="horizontal">
      <Title level={5}>Thông số</Title>
      <Switch
        checked={isChecked}
        onChange={handleSwitchChange}
        checkedChildren="Tài khoản"
        unCheckedChildren="Thiết bị"
      />
    </Space>
  </div>
);

export default SwitchComponent;
