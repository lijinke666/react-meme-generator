import React from 'react'
import classNames from "classnames"
import "./index.less"
export default class Container extends React.PureComponent{
    render(){
        const {className,...attr} = this.props
        return(
            <div key="container" className="container">
                <div className={classNames("wrap",className)} {...attr}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}