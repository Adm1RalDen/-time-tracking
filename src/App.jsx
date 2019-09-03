import React from 'react';
import { observer, inject } from "mobx-react";

import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './Style/App.css';

import Contents from './Components/Content';
import Footers from './Components/Footer';
import Headers from './Components/Header';
const { Footer, Content } = Layout;
const App = inject('Store')(observer(
    function App(props) {
        return (
            <div>
                <Layout>
                    <Headers />
                    <Contents />
                    <Footers />
                </Layout>
            </div>
        );
    }
))
export default App
