import React, { PureComponent } from "react"
import Container from "./components/Container"
import { Button, Divider, Col, Row, Form, Input } from "antd"

const { FormItem } = Form
const prefix = 'react-meme'

class ReactMeme extends PureComponent {
    createMeme = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
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
        return (
            <Container className={prefix}>
                <Divider><h2 className="title">{prefix}</h2></Divider>
                <section className={`${prefix}-main`}>
                    <Row>
                        <Col span="8">
                            <Button type="primary">测试</Button>
                        </Col>
                        <Col span="16">
                            {/* <Form onSubmit={this.createMeme}>
                                <FormItem     
                                    {...formItemLayout}
                                    label="文字"
                                >
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Input placeholder="Username" />
                                        )}
                                </FormItem>
                                <FormItem     
                                    {...formItemLayout}
                                    label="文字"
                                >
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                    })(
                                        <Input type="password" placeholder="Password" />
                                        )}
                                </FormItem>
                                <FormItem {...buttonItemLayout}>
                                    <Button type="primary" htmlType="submit">开始制作</Button>
                                </FormItem>
                            </Form> */}
                        </Col>
                    </Row>
                </section>
                <Divider>开发中</Divider>
            </Container>
        )
    }
}

const _ReactMeme = Form.create()(ReactMeme)

export default _ReactMeme