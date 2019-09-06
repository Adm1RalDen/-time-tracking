import React from 'react'
import '../Style/Header.css';
import { inject, observer } from 'mobx-react';
import { Typography, Button, message, Icon, Popconfirm } from 'antd';
import { Layout } from 'antd';

const { Title } = Typography;

const Header = inject('Store')(observer((props) => {
    const { data, setData, counts, setCounts } = props.Store;
    let getTimes = () => {
        let today = new Date();
        return (('0' + today.getDate()).slice(-2) + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + today.getFullYear()
            + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());

    }
    let add = () => {
        let newData = {
            key: counts.toString(),
            date: getTimes(),
            message: '',
            futurePlan: '',
            workHours: 0
        };
        setData([...data, newData]);
        setCounts(counts + 1);
    }
    let upload = () => {
        let dataUpload = JSON.parse(localStorage.getItem('time-tracking-date'));
        if (dataUpload !== null) {
            if (dataUpload.length == 0) {
                message.warning('data lenth equal zero');
            } else {
                setData(dataUpload);
                message.success('Success upload');
            }
        } else {
            message.error('Empty storage !');
        }
    }
    let save = () => {
        if (data.length === 0) {
            message.warning('data lenth equal zero');
        } else {
            localStorage.setItem('time-tracking-date', JSON.stringify(data));
            message.success('Success save');
        }
    }
    return (
        <Layout.Header>
            <Title level={4} type='secondary' id='headerText'>Time Tracking</Title>
            <div className='button-container'>
                <Button type='primary' onClick={save}><Icon type="save" /></Button>
                {data.length !== 0 ?
                    <Popconfirm title="Sure to upload?" onConfirm={upload}>
                        <Button type='primary'><Icon type="upload" /></Button>
                    </Popconfirm>
                    :
                    <Button type='primary' onClick={upload}><Icon type="upload" /></Button>
                }

                {/* <Button type='primary' onClick={add}><Icon type="plus" /></Button> */}
            </div>

        </Layout.Header>

    );
}))
export default Header