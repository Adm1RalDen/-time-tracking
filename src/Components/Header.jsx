import React from 'react'
import '../Style/Header.css';

import { Typography } from 'antd';
const { Title } = Typography;
function Header (props){
    return (
        <div className = 'header'>
            <Title level={4} type = 'secondary' id = 'headerText'>Time Tracking</Title>
        </div>
    );
}
export default Header