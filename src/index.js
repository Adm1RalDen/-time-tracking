import React from 'react'
import ReactDOM from 'react-dom'
import Store from './Store/Store'
import { Provider } from 'mobx-react'

import App from './App';

const stores = { Store };
ReactDOM.render(
    <Provider {...stores}>
       <App />
    </Provider>,
    document.getElementById('root')
)
                                  