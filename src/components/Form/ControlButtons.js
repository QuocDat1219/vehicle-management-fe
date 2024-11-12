import { Button, Card, Space } from "antd";

const ControlButtons = ({ handleRun, runLoading, handleClear }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Space direction="horizontal">
            <Button type="primary" onClick={handleRun} loading={runLoading}>
                {runLoading ? "Loading" : "Run"}
            </Button>
            <Button type="primary" danger onClick={handleClear}>
                Clear Terminal
            </Button>
        </Space>
    </div>

);
export default ControlButtons