import React from "react"
import ReactDOM from "react-dom"
import ReactMemeGenerator from "../src"
import {LocaleProvider} from "antd"
import ErrorBoundary from "../src/components/ErrorBoundary"
import zhCN from 'antd/lib/locale-provider/zh_CN'

import "../src/styles/index.less"
import "./example.less"


const Demo = () => (
    <ErrorBoundary>
        <LocaleProvider locale={zhCN}>
            <ReactMemeGenerator />
        </LocaleProvider>
     </ErrorBoundary>
)
ReactDOM.render(
    <Demo/>,
    document.getElementById('root')
)
