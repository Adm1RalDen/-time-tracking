import React from 'react'
import { Typography } from 'antd';
import { Layout } from 'antd';
import '../Style/Footer.css';

const { Title } = Typography;
function Footer(props) {
    return (
        <Layout.Footer className = 'footer'>
            <Title level={4}>Time Tracking. Created by Adm1RalDen</Title>
        </Layout.Footer>
    );
}
export default Footer