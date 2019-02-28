import { Icon } from 'antd';
import React, { Component } from 'react';

type Props = {
    type: string;
};

class FormItemIcon extends Component<Props> {
    render() {
        return (
            <div
                className="ant-row ant-form-item"
                style={{
                    paddingTop: '8px',
                    fontSize: '16px'
                }}
            >
                <Icon type={this.props.type} />
            </div>
        );
    }
}

export { FormItemIcon };
