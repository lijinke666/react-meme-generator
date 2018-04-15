/**
 * @name react 表情包 制作器
 * @author jinke.li
 * TODO
 * 文字 高度 计算
 * 预览区域支持 粘贴图片
 * 完成 摄像头捕捉
 */
import React, { PureComponent } from "react"
import Container from "./components/Container"
import cls from "classnames"
import { Button, Divider, Col, Row, Form, Input, Checkbox, Modal, message, Select, Slider, Tooltip } from "antd"
import { SketchPicker } from 'react-color'
import Draggable from "react-draggable"
import dometoimage from "dom-to-image"
import {
    prefix,
    fontFamily,
    defaultFontText,
    defaultFontColor,
    imageProcess,
    defaultFontSize,
    fontSize,
    maxFileSize as IMG_MAX_SIZE,
    previewContentStyle,
    range,
    whellScaleRange,
    defaultScale,
    defaultRotate
} from "./config"
import { isImage } from "./utils"
import { name as APPNAME, version as APPVERSION, repository } from "../package.json"

const { FormItem } = Form
const { Option } = Select
const { TextArea } = Input

class ReactMeme extends PureComponent {
    state = {
        cameraVisible: false,
        displayColorPicker: false,
        fontColor: defaultFontColor,
        fontSize: defaultFontSize,
        text: defaultFontText,
        font: fontFamily[0].value,
        loadingImgReady: false,
        dragAreaClass: false,        //拖拽区域active class
        textDragX: 0,
        textDragY: 0,
        imageDragX: 0,
        imageDragY: 0,
        isRotateText: false,
        rotate: defaultRotate,          //旋转角度
        scale: defaultScale,           //缩放比例
        toggleText: false               //为false  文字换行时属于整体 反之为独立的一行 不受其他控制
    }
    activeDragAreaClass = "drag-active"
    constructor(props) {
        super(props)
    }
    static defaultProps = {
        defaultFont: fontFamily[0].value,
        defaultImageProcess: imageProcess[0].value,
        defaultText: defaultFontText,
        defaultFontSize,
        drag: true
    }
    imageWidthChange = (e)=>{
        this.setState({width:e.target.value})
    }
    imageHeightChange = (e)=>{
        this.setState({height:e.target.value})
    }
    toggleColorPicker = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    }
    closeColorPircker = () => {
        this.setState({ displayColorPicker: false })
    }
    colorChange = ({ hex }) => {
        this.setState({ fontColor: hex })
    }
    drawMeme = () => {
        const {width,height,loadingImgReady} = this.state
        if (!loadingImgReady) return message.error('请选择图片!')
        const imageArea = document.querySelector('.preview-content')
        dometoimage.toPng(imageArea,{
            width,height
        })
            .then((dataUrl) => {
                Modal.confirm({
                    title: "生成成功",
                    content: (
                        <img src={dataUrl} style={{ "maxWidth": "100%" }} />
                    ),
                    onOk: () => {
                        var link = document.createElement('a');
                        link.download = `${Date.now()}.png`
                        link.href = dataUrl
                        link.click()
                    },
                    okText: "立即下载",
                    cancelText: "再改一改"
                })
            })
            .catch((err) => {
                message.error(err)
            })
    }
    closeImageWhellTip = () => {
        this.setState({ imageWhellTipVisible: false })
    }
    resizeImageScale = () => {
        const { scale } = this.state
        if (scale != defaultScale) {
            this.setState({ scale: defaultScale })
        }
    }
    resetImageRotate = () => {
        const { rotate } = this.state
        if (rotate != defaultRotate) {
            this.setState({ scale: defaultRotate })
        }
    }
    bindMouseWheel = (e) => {
        const y = e.deltaY ? e.deltaY : e.wheelDeltaY    //火狐有特殊
        const [min, max] = whellScaleRange
        this.setState(({ scale }) => {
            let _scale = scale
            if (y > 0) {
                _scale -= range
                _scale = Math.max(min, _scale)
                return {
                    scale: _scale,
                    imageWhellTipVisible: true
                }
            } else {
                _scale += range
                _scale = Math.min(max, _scale)
                return {
                    scale: _scale,
                    imageWhellTipVisible: true
                }
            }

        })
        return false
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
                        cameraUrl,
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
    fontSizeChange = (value) => {
        this.setState({ fontSize: value })
    }
    //截取当前摄像头 帧
    screenShotCamera = () => {

    }
    onSelectFile = () => {
        this.file.click()
    }
    imageChange = () => {
        const files = Array.from(this.file.files)
        this.renderImage(files)
    }
    renderImage = (files = []) => {
        files.forEach((file) => {
            let { type, name, size } = file
            if (!isImage(type)) {
                return message.error('无效的图片格式')
            }
            if (~~(size / 1024) >= IMG_MAX_SIZE) {
                let maxSize = IMG_MAX_SIZE > 1024 ? `${IMG_MAX_SIZE}MB` : `${IMG_MAX_SIZE}KB`
                return message.warning(`图片最大 ${maxSize}!`)
            }
            this.setState({ loading: true })
            const url = window.URL.createObjectURL(file)
            this.setState({
                currentImg: {
                    src: url,
                    size: `${~~(size / 1024)}KB`,
                    type
                },
                scale: defaultScale,
                loading: false,
                loadingImgReady: true,
            })
        })
    }
    stopAll = (target) => {
        target.stopPropagation()
        target.preventDefault()
    }
    //绑定拖拽事件
    addDragListener = (dragArea, dragAreaClass = true) => {
        document.addEventListener('dragenter', (e) => {
            this.addDragAreaStyle();
        }, false);
        document.addEventListener('dragleave', (e) => {
            this.removeDragAreaStyle();
        }, false);
        //进入
        dragArea.addEventListener('dragenter', (e) => {
            this.stopAll(e)
            this.addDragAreaStyle();
        }, false);
        //离开
        dragArea.addEventListener('dragleave', (e) => {
            this.stopAll(e)
            this.removeDragAreaStyle()
        }, false);
        //移动
        dragArea.addEventListener('dragover', (e) => {
            this.stopAll(e)
            this.addDragAreaStyle()
        }, false);
        dragArea.addEventListener('drop', (e) => {
            this.stopAll(e)
            this.removeDragAreaStyle()
            const files = (e.dataTransfer || e.originalEvent.dataTransfer).files
            this.renderImage(Array.from(files))
        }, false)
    }
    addDragAreaStyle = () => {
        this.setState({ dragAreaClass: true })
    }
    removeDragAreaStyle = () => {
        this.setState({ dragAreaClass: false })
    }
    textChange = (e) => {
        const text = e.target.value
        this.setState({ text })
    }
    fontFamilyChange = (value) => {
        this.setState({ font: value })
    }
    stopDragText = (e, { x, y }) => {
        this.setState({
            textDragX: x,
            textDragY: y
        })
    }
    stopDragImage = (e, { x, y }) => {
        this.setState({
            imageDragX: x,
            imageDragY: y
        })
    }
    rotateImage = (value) => {
        this.setState({ rotate: value })
    }
    toggleRotateStatus = (e) => {
        this.setState({
            isRotateText: e.target.checked
        })
    }
    toggleText = (e) => {
        this.setState({ toggleText: e.target.checked })
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
            fontSize,
            font,
            text,
            displayColorPicker,
            loading,
            loadingImgReady,
            currentImg,
            dragAreaClass,
            textDragX,
            textDragY,
            imageDragX,
            imageDragY,
            isRotateText,
            rotate,
            scale,
            imageWhellTipVisible,
            toggleText
        } = this.state

        const _scale = (scale).toFixed(2)

        const {
            defaultFont,
            defaultFontSize,
            defaultImageProcess,
            defaultText
        } = this.props

        const labelSpan = 4
        const valueSpan = 19
        const offsetSpan = 1

        const operationRow = ({ icon = "edit", label, component }) => (
            <Row className={`${prefix}-item`}>
                <Col span={labelSpan} className={`${prefix}-item-label`}><Button type="dashed" icon={icon}>{label}</Button></Col>
                <Col span={valueSpan} offset={offsetSpan} className={`${prefix}-item-input`}>{component}</Col>
            </Row>
        )

        const imageTransFormConfig = {
            transform: `rotate(${rotate}deg) scale(${_scale})`
        }

        return (
            <Container className={prefix}>
                <Divider><h2 className="title"><a href={repository.url}>{APPNAME}</a></h2></Divider>
                <section className={`${prefix}-main`} ref={previewArea => this.previewArea = previewArea}>
                    <Row>
                        <Col span="8">
                            <Tooltip
                                placement="top"
                                title={[
                                    <span className="tip-text" key="tip-text">缩放比例: {_scale}</span>,
                                    <Button key="resize-btn" className={`${prefix}-resize-btn`} size="small" onClick={this.resizeImageScale}>还原</Button>
                                ]
                                }
                                visible={imageWhellTipVisible}

                            >
                                <div
                                    ref={node => this.previewContent = node}
                                    className={cls("preview-content", {
                                        [this.activeDragAreaClass]: dragAreaClass
                                    })}
                                    onWheel={this.bindMouseWheel}
                                    onMouseLeave={this.closeImageWhellTip}
                                    style={isRotateText ? imageTransFormConfig : {}}
                                >
                                    {
                                        loadingImgReady
                                            ?

                                            <Draggable
                                                onStop={this.stopDragImage}
                                                defaultPosition={{ x: 0, y: 0 }}
                                            >
                                                <div>
                                                    <img
                                                        className="preview-image"
                                                        ref={node => this.previewImage = node}
                                                        src={currentImg.src}
                                                        style={loadingImgReady ? imageTransFormConfig : {}}
                                                    />

                                                </div>
                                            </Draggable>
                                            : undefined
                                    }

                                    {
                                        toggleText
                                            ?
                                            text.split(/\n/).map((value, i) => {
                                                return (
                                                    <Draggable
                                                        bounds="parent"
                                                        onStop={this.stopDragText}
                                                        key={i}
                                                        defaultPosition={{ x: 0, y: fontSize * i }}
                                                    >
                                                        <div key={i} className={`${prefix}-text`}
                                                            style={{
                                                                color: fontColor,
                                                                fontSize,
                                                                fontFamily: font
                                                            }}
                                                        >
                                                            {value}
                                                        </div>
                                                    </Draggable>
                                                )
                                            })
                                            :
                                            <Draggable defaultPosition={{ x: 0, y: 0 }}>
                                                <pre className={`${prefix}-text`}
                                                    style={{
                                                        color: fontColor,
                                                        fontSize,
                                                        fontFamily: font
                                                    }}
                                                >
                                                    {text}
                                                </pre>
                                            </Draggable>
                                    }
                                </div>
                            </Tooltip>

                            <Row>
                                <input type="file" className="hidden" accept="image/*" ref={node => this.file = node} onChange={this.imageChange} />
                                <Col span={4}><Button type="primary" loading={loading} onClick={this.onSelectFile}>{loading ? "请稍后" : "选择图片"}</Button></Col>
                                <Col span={4} offset={2}><Button type="primary" onClick={this.openCamera}>使用摄像头</Button></Col>
                            </Row>
                        </Col>
                        <Col span="16">
                            {
                                operationRow({
                                    label: "文字",
                                    component: [
                                        <TextArea
                                            autosize={true}
                                            value={text}
                                            onChange={this.textChange}
                                            style={{ marginBottom: 10 }}
                                        />,
                                        <Checkbox value={toggleText} onChange={this.toggleText}>每行文字独立控制</Checkbox>,
                                    ]
                                })
                            }
                            {
                                operationRow({
                                    icon: "file-ppt",
                                    label: '字体',
                                    component: (
                                        <Select style={{ width: "100%" }} defaultValue={defaultFont} onChange={this.fontFamilyChange}>
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
                                    icon: "pie-chart",
                                    label: '文字颜色',
                                    component: (
                                        <div>
                                            <div className="color-section" onClick={this.toggleColorPicker}>
                                                <div
                                                    className="color"
                                                    style={{
                                                        background: fontColor
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
                                    icon: "line-chart",
                                    label: '图片大小',
                                    component:(
                                        <Row>
                                            <Col span={11}>
                                            <Input placeholder="宽" defaultValue={previewContentStyle.width} addonAfter="px" addonBefore="宽" onChange={this.imageWidthChange}/>
                                            </Col>
                                            <Col span={11} offset={2}>
                                            <Input placeholder="高" defaultValue={previewContentStyle.height}  addonAfter="px" addonBefore="高" onChange={this.imageHeightChange}/>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                            {
                                operationRow({
                                    icon: "line-chart",
                                    label: '文字大小',
                                    component: (
                                        <Slider
                                            min={fontSize[0]}
                                            max={fontSize[fontSize.length - 1]}
                                            defaultValue={defaultFontSize}
                                            tipFormatter={(value) => `${value}px`}
                                            onChange={this.fontSizeChange}
                                        />
                                    )
                                })
                            }
                            {
                                operationRow({
                                    icon: "line-chart",
                                    label: '图像旋转',
                                    component: (
                                        <Row>
                                            <Col span={24}>
                                                <Slider
                                                    min={0}
                                                    max={360}
                                                    defaultValue={0}
                                                    tipFormatter={(value) => `${value}°`}
                                                    onChange={this.rotateImage}
                                                    disabled={!loadingImgReady}
                                                />
                                            </Col>
                                        </Row>

                                    )
                                })
                            }
                            <Row>
                                <Col span={3}><Button type="primary" style={{ "width": "100%" }} onClick={this.drawMeme}>确认生成</Button></Col>
                            </Row>
                        </Col>
                    </Row>
                </section>
                <Divider>{APPVERSION}</Divider>

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
        const { drag } = this.props
        drag && this.addDragListener(this.previewArea)
    }
}

const _ReactMeme = Form.create()(ReactMeme)

export default _ReactMeme