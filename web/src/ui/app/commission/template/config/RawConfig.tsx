import { Col, Input, Row } from 'antd';
import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect, DispatchProp } from 'react-redux';

import { CommissionStatementTemplateEdit, receiveCommissionStatementTemplate } from '@/state/app/commission/templates';
import { Button } from '@/ui/controls';
import { showMessage } from '@/ui/feedback/notifcation';

const { TextArea } = Input;

type Props = {
    template: CommissionStatementTemplateEdit;
} & DispatchProp;

type State = {
    config: string;
};

class RawConfig extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            config: ''
        };
    }

    onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ config: event.target.value });
    };

    override = () => {
        try {
            const template = {
                ...this.props.template,
                config: JSON.parse(this.state.config)
            };
            this.props.dispatch(receiveCommissionStatementTemplate(template));
            showMessage('info', 'Config Fields Updated', 3);
        } catch {
            showMessage('error', 'Config error, please check syntax', 5);
        }
    };

    render() {
        return (
            <>
                <Row type="flex" justify="space-between">
                    <Col>
                        <h4>Current Config</h4>
                    </Col>
                    <Col>
                        <CopyToClipboard
                            text={JSON.stringify(
                                this.props.template.config,
                                null,
                                4
                            )}
                            onCopy={() => {
                                showMessage('info', 'Config Copied', 2);
                            }}
                        >
                            <Button
                                icon="copy"
                                //onClick={() => this.add()}
                                noLeftMargin={true}
                                size="small"
                            >
                                {`Copy Config`}
                            </Button>
                        </CopyToClipboard>
                    </Col>
                </Row>

                <TextArea
                    rows={6}
                    value={JSON.stringify(this.props.template.config, null, 4)}
                    disabled={true}
                />

                <Row type="flex" justify="space-between" className="mt-2">
                    <Col>
                        <h4>Override Config</h4>
                    </Col>
                </Row>
                <TextArea
                    rows={8}
                    value={this.state.config}
                    onChange={this.onChange}
                />
                <Button
                    icon="edit"
                    onClick={() => this.override()}
                    type="primary"
                    noLeftMargin={true}
                    disabled={!this.state.config}
                    className="mt-1"
                >
                    {`Override Current Config`}
                </Button>
                {this.state.config && (
                    <small className="ml-1">
                        * this will only update the form fields, template will
                        NOT be saved until clicking the 'Save' button.
                    </small>
                )}
            </>
        );
    }
}

export default connect()(RawConfig);
