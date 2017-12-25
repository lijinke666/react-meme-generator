import React, { PureComponent } from "react"
import Container from "./components/Container"
import { Button, Divider, Col, Row, Form, Input, Modal, message, Select,Slider } from "antd"
import { SketchPicker } from 'react-color'
import { fontFamily, defaultFontText,imageProcess,defaultFontSize,fontSize } from "./config"

const { FormItem } = Form
const { Option } = Select
const { TextArea } = Input

const prefix = 'react-meme'

class ReactMeme extends PureComponent {
    state = {
        cameraVisible: false,
        displayColorPicker: false,
        fontColor:"#444",
        defaultFontSize
    }
    constructor(props) {
        super(props)
    }
    static defaultProps = {
        defaultFont: fontFamily[0].value,
        defaultImageProcess:imageProcess[0].value,
        defaultText: defaultFontText,
        defaultFontSize
    }
    toggleColorPicker = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    }
    closeColorPircker = () => {
        this.setState({ displayColorPicker: false })
    }
    colorChange = ({ hex }) => {
        this.setState({ fontColor: hex })
    };
    createMeme = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        })
    }
    openCamera = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
                .then((data) => {
                    const cameraUrl = window.URL.createObjectURL(data)
                    this.setState({
                        // cameraUrl,
                        cameraVisible: true
                    })
                })
                .catch((error) => {
                    Modal.error({
                        title: "调用摄像头失败",
                        content: error
                    })
                    this.setState({ cameraVisible: false })
                })
        } else {
            Modal.error({ title: '抱歉,你的电脑暂不支持摄像头!' })
            this.setState({ cameraVisible: false })
        }
        // this.setState({ cameraVisible: true })

    }
    closeCamera = () => {
        this.setState({ cameraVisible: false })
    }
    fontSizeChange = (value)=>{
        console.log(value);
    }
    //截取当前摄像头 帧
    screenShotCamera = () => {

    }
    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        }
        const buttonItemLayout = {
            wrapperCol: { span: 14, offset: 4 },
        }

        const {
            cameraVisible,
            cameraUrl,
            fontColor,
            displayColorPicker
        } = this.state

        const {
            defaultFont,
            defaultFontSize,
            defaultImageProcess,
            defaultText
        } = this.props

        const labelSpan = 4
        const valueSpan = 19
        const offsetSpan = 1

        const operationRow = ({ icon = "edit" ,label, component }) => (
            <Row className={`${prefix}-item`}>
                <Col span={labelSpan} className={`${prefix}-item-label`}><Button type="primary" icon={icon}>{label}</Button></Col>
                <Col span={valueSpan} offset={offsetSpan} className={`${prefix}-item-input`}>{component}</Col>
            </Row>
        )

        return (
            <Container className={prefix}>
                <Divider><h2 className="title">{prefix}</h2></Divider>
                <section className={`${prefix}-main`}>
                    <Row>
                        <Col span="8">
                            <div className="preview-content">
                                
                            </div>
                            <Button type="primary">选择图片</Button>
                        </Col>
                        <Col span="16">
                            {
                                operationRow({
                                    label: '文字',
                                    component: (
                                        <TextArea
                                            autosize={true}
                                            defaultValue={defaultText}
                                        />
                                    )
                                })
                            }
                            {
                                operationRow({
                                    icon:"file-ppt",
                                    label: '字体',
                                    component: (
                                        <Select style={{ width: "100%" }} defaultValue={defaultFont}>
                                            {
                                                fontFamily.map(({ label, value }, i) => (
                                                    <Option value={value} key={i}>{label}</Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                })
                            }
                            {
                                operationRow({
                                    icon:"pie-chart",
                                    label: '颜色',
                                    component: (
                                        <div>
                                            <div className="color-section" onClick={this.toggleColorPicker}>
                                                <div 
                                                    className="color" 
                                                    style={{
                                                    background:fontColor
                                                    }}
                                                />
                                            </div>
                                            {
                                                displayColorPicker 
                                                ? <div className="popover">
                                                    <div className="cover" onClick={this.closeColorPircker} />
                                                    <SketchPicker 
                                                        color={fontColor} 
                                                        onChange={this.colorChange} 
                                                    />
                                                </div> 
                                                : undefined

                                            }
                                        </div>
                                    )
                                })
                            }
                            {
                                operationRow({
                                    icon:"picture",
                                    label: '图片处理',
                                    component: (
                                        <Select style={{ width: "100%" }} defaultValue={defaultImageProcess}>
                                            {
                                                imageProcess.map(({ label, value }, i) => (
                                                    <Option value={value} key={i}>{label}</Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                })
                            }
                            {
                                operationRow({
                                    icon:"line-chart",
                                    label: '文字大小',
                                    component: (
                                        <Slider 
                                            min={fontSize[0]}
                                            max={fontSize[fontSize.length-1]}
                                            defaultValue={defaultFontSize} 
                                            onAfterChange={this.fontSizeChange}
                                        />
                                    )
                                })
                            }
                            <Row>
                                <Col offset={5}><Button type="primary" onClick={this.openCamera}>使用摄像头</Button></Col>
                            </Row>
                        </Col>
                    </Row>
                </section>
                <Divider>开发中</Divider>

                <Modal
                    maskClosable={false}
                    visible={cameraVisible}
                    title="摄像头当素材"
                    okText="使用当前画面"
                    cancelText="算了太丑了"
                    onCancel={this.closeCamera}
                    onOk={this.screenShotCamera}
                >
                    <video src={cameraUrl}></video>
                </Modal>
            </Container>
        )
    }
    componentDidMount() {
        Modal.info({
            title:"开发中...",
            content:"敬请期待"
        })
    }
}

const _ReactMeme = Form.create()(ReactMeme)

export default _ReactMeme