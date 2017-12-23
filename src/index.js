import React, { PureComponent } from "react"
import Container from "./components/Container"
import { Button, Divider, Col, Row, Form, Input, Modal, message } from "antd"

const { FormItem } = Form
const prefix = 'react-meme'

class ReactMeme extends PureComponent {
    state = {
        cameraVisible: false
    }
    constructor(props) {
        super(props)
    }
    createMeme = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        })
    }
    openCamera = () => {
        if (navigator.mediaDevices &&  navigator.mediaDevices.getUserMedia) {
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
                this.setState({cameraVisible: false})
            })
        } else {
            Modal.error({title: '抱歉,你的电脑暂不支持摄像头!'})
            this.setState({cameraVisible: false})
        }
        // this.setState({ cameraVisible: true })

    }
    closeCamera = () => {
        this.setState({ cameraVisible: false })
    }
    //截取当前摄像头 帧
    screenShotCamera = ()=>{

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
            cameraUrl
        } = this.state

        return (
            <Container className={prefix}>
                <Divider><h2 className="title">{prefix}</h2></Divider>
                <section className={`${prefix}-main`}>
                    <Row>
                        <Col span="8">
                            <Button type="primary" onClick={this.openCamera}>使用摄像头</Button>
                        </Col>
                        <Col span="16">

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
    }
}

const _ReactMeme = Form.create()(ReactMeme)

export default _ReactMeme