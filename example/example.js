import React from "react"
import ReactDOM from "react-dom"
import ReactMemeGenerator from "../src"
import {LocaleProvider} from "antd"
import zhCN from 'antd/lib/locale-provider/zh_CN'

import "../src/styles/index.less"
import "./example.less"


const Demo = () => (
    <LocaleProvider locale={zhCN}>
        <ReactMemeGenerator />
     </LocaleProvider>
)
ReactDOM.render(
    <Demo/>,
    document.getElementById('root')
)
