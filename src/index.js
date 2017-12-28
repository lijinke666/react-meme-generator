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
import { Button, Divider, Col, Row, Form, Input, Checkbox, Modal, message, Select, Slider } from "antd"
import { SketchPicker } from 'react-color'
import Draggable from "react-draggable"
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
    maxScale
} from "./config"
import { isImage } from "./utils"

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
        rotate: 0,          //旋转角度
        scale: 1.0           //缩放比例
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
        const {
            fontSize,
            fontColor,
            font,
            rotate,
            text,
            scale,
            textDragX,
            textDragY,
            imageDragX,
            imageDragY,
            currentImg: {
                src,
                type
            }
        } = this.state

        console.log(textDragX, textDragY);

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = previewContentStyle.width
        canvas.height = previewContentStyle.height

        const imgOffset = this.previewImage.getBoundingClientRect()
        const clipOffset = this.previewContent.getBoundingClientRect()

        const sx = ~~(clipOffset.left - imgOffset.left)
        const sy = ~~(clipOffset.top - imgOffset.top)
        return new Promise((res, rej) => {
            const image = new Image()
            image.src = src
            image.onload = () => {
                ctx.save()
                ctx.rotate(rotate * Math.PI / 180)
                ctx.drawImage(
                    image,
                    sx / scale,
                    sy / scale,
                    previewContentStyle.width / scale,
                    previewContentStyle.height / scale,
                    0, 0,
                    previewContentStyle.width,
                    previewContentStyle.height
                )
                if (!!text) {
                    const textCanvas = this.drawTextWaterMark(
                        textDragX,
                        textDragY
                    )
                    ctx.drawImage(textCanvas, textDragX, textDragY)
                }
                ctx.restore()
                const result = canvas.toDataURL("image/png")
                res(result)
            }
            image.onerror = (err) => rej(err)
        })

    }
    //绘制文字水印
    drawTextWaterMark = (fillX, fillY) => {
        const {
            fontSize,
            fontColor,
            font,
            text
        } = this.state

        const textCanvas = document.createElement('canvas')
        const waterMarkCtx = textCanvas.getContext('2d')
        const { width: textWidth } = waterMarkCtx.measureText(text)  //文字宽度

        waterMarkCtx.font = `${fontSize}px ${font}`
        waterMarkCtx.fillStyle = fontColor
        waterMarkCtx.textBaseline = "middle"
        //TODO getImageData 算出有颜色区域的 宽高 目前 高度无法计算
        waterMarkCtx.fillText(text, fillX - textWidth, fillY)

        return textCanvas

    }
    bindMouseWheel = (e) => {
        const y = e.deltaY ? e.deltaY : e.wheelDeltaY    //火狐有特殊
        this.setState(({ scale }) => {
            if (y > 0) {
                return {
                    scale: scale -= range
                }
            } else {
                return {
                    scale: scale += range
                }
            }
        })
        return false
    }
    createMeme = (e) => {
        if (!this.state.loadingImgReady) return message.error('请选择图片!')
        this.drawMeme().then((meme) => {
            Modal.confirm({
                title: "确认生成吗?",
                content: (
                    <img src={meme} style={{ "maxWidth": "100%" }} />
                ),
                onOk: () => {
                    const blob = new Blob(["\ufeff"+meme],{
                        type:"image/png"
                    })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.setAttribute('href',url)
                    link.setAttribute('download',Date.now())
                    link.click()
                }
            })
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
    fontSizeChange = (value) => {
        this.setState({ fontSize: value })
        console.log(value);
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
            // const reader = new FileReader()
            // reader.onloadstart = () => {
            //     this.setState({ loading: true })
            // }
            // reader.onabort = () => {
            //     this.setState({
            //         loading: false,
            //         loadingImgReady: false,
            //         currentImg: {}
            //     })
            //     message.error(`${name}读取中断!`)
            // };
            // reader.onerror = () => {
            //     this.setState({
            //         loading: false,
            //         loadingImgReady: false,
            //         currentImg: {}
            //     })
            //     message.error(`${name}读取失败`)
            // };
            // reader.onload = (e) => {
            //     const result = e.target.result        //读取失败时  null   否则就是读取的结果
            //     this.setState({
            //         loading: false,
            //         loadingImgReady: true,
            //         currentImg: {
            //             src: result,
            //             size: `${~~(size / 1024)}KB`,
            //             type
            //         }
            //     })
            // }
            // reader.readAsBinaryString(file)      //二进制
            const url = window.URL.createObjectURL(file)
            this.setState({
                currentImg: {
                    src: url,
                    size: `${~~(size / 1024)}KB`,
                    type
                },
                loading:false,
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
    textChnage = (e) => {
        this.setState({ text: e.target.value })
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
    stopDragImage = (e, { x, y}) => {
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
            scale
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

        const operationRow = ({ icon = "edit", label, component }) => (
            <Row className={`${prefix}-item`}>
                <Col span={labelSpan} className={`${prefix}-item-label`}><Button type="dashed" icon={icon}>{label}</Button></Col>
                <Col span={valueSpan} offset={offsetSpan} className={`${prefix}-item-input`}>{component}</Col>
            </Row>
        )

        const imageTransFormConfig = {
            transform: `rotate(${rotate}deg) scale(${scale})`
        }

        return (
            <Container className={prefix}>
                <Divider><h2 className="title">{prefix}</h2></Divider>
                <section className={`${prefix}-main`} ref={previewArea => this.previewArea = previewArea}>
                    <Row>
                        <Col span="8">
                            <div
                                ref={node => this.previewContent = node}
                                className={cls("preview-content", {
                                    [this.activeDragAreaClass]: dragAreaClass
                                })}
                                onWheel={this.bindMouseWheel}
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
                                <Draggable
                                    bounds="parent"
                                    onStop={this.stopDragText}
                                    defaultPosition={{ x: 0, y: 0 }}
                                >
                                    <div className={`${prefix}-text`}
                                        style={{
                                            color: fontColor,
                                            fontSize,
                                            fontFamily: font
                                        }}
                                    >
                                        {text}
                                    </div>
                                </Draggable>
                            </div>
                            <Row>
                                <input type="file" className="hidden" accept="image/*" ref={node => this.file = node} onChange={this.imageChange} />
                                <Col span={4}><Button type="primary" loading={loading} onClick={this.onSelectFile}>{loading ? "请稍后" : "选择图片"}</Button></Col>
                                <Col span={4} offset={2}><Button type="primary" onClick={this.openCamera}>使用摄像头</Button></Col>
                            </Row>
                        </Col>
                        <Col span="16">
                            {
                                operationRow({
                                    label: '文字',
                                    component: (
                                        <TextArea
                                            autosize={true}
                                            value={text}
                                            onChange={this.textChnage}
                                        />
                                    )
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
                                    icon: "picture",
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
                                            <Col span={19}>
                                                <Slider
                                                    min={0}
                                                    max={360}
                                                    defaultValue={0}
                                                    tipFormatter={(value) => `${value}°`}
                                                    onChange={this.rotateImage}
                                                    disabled={!loadingImgReady}
                                                />
                                            </Col>
                                            {/* <Col span={4} offset={1}>
                                            <Checkbox value={isRotateText} disabled={!loadingImgReady} onChange={this.toggleRotateStatus}>旋转文字</Checkbox></Col> */}
                                        </Row>

                                    )
                                })
                            }
                            <Row>
                                <Col span={3}><Button type="primary" onClick={this.createMeme}>确认生成</Button></Col>
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
        const { drag } = this.props
        drag && this.addDragListener(this.previewArea)
    }
}

const _ReactMeme = Form.create()(ReactMeme)

export default _ReactMeme