import React from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import excelFile from '../../assets/files/sample_data.xlsx';
const DownloadExcelButton = () => {
    const downloadExcelFile = () => {
        const a = document.createElement('a');
        a.href = excelFile;
        a.download = 'sample_data.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Button
            type="dashed"
            icon={<DownloadOutlined />}
            onClick={downloadExcelFile}
            style={{ borderColor: '#4CAF50', color: '#4CAF50' }}
        >
            Tải xuống file Excel
        </Button>
    );
};

export default DownloadExcelButton;
