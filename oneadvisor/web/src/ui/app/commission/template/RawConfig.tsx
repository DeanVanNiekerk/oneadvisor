import { Col, Input, Row } from "antd";
import React, { Component } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { connect, DispatchProp } from "react-redux";

import {
    CommissionType as LookupCommissionType,
    commissionTypesSelector,
    UNKNOWN_COMMISSION_TYPE_CODE,
} from "@/state/app/commission/lookups";
import {
    CommissionStatementTemplateEdit,
    Config,
    receiveCommissionStatementTemplate,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

const { TextArea } = Input;

type Props = {
    template: CommissionStatementTemplateEdit;
    lookupCommissionTypes: LookupCommissionType[];
} & DispatchProp;

type State = {
    config: string;
};

class RawConfig extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            config: "",
        };
    }

    onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ config: event.target.value });
    };

    override = () => {
        try {
            const config = JSON.parse(this.state.config) as Config;

            config.sheets.forEach(sheet => {
                //Validate commission type codes ------------------
                if (!this.isValidCommissionType(sheet.config.commissionTypes.defaultCommissionTypeCode))
                    sheet.config.commissionTypes.defaultCommissionTypeCode = UNKNOWN_COMMISSION_TYPE_CODE;

                sheet.config.commissionTypes.types = sheet.config.commissionTypes.types.map(t => ({
                    commissionTypeCode: this.isValidCommissionType(t.commissionTypeCode) ? t.commissionTypeCode : "",
                    value: t.value,
                }));
                //--------------------------------------------------
            });

            const template = {
                ...this.props.template,
                config: config,
            };

            this.props.dispatch(receiveCommissionStatementTemplate(template));
            showMessage("info", "Config Fields Updated", 3);
        } catch {
            showMessage("error", "Config error, please check syntax", 5);
        }
    };

    isValidCommissionType = (code: string): boolean => {
        return !!this.props.lookupCommissionTypes.find(t => t.code === code);
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
                            text={JSON.stringify(this.props.template.config, null, 4)}
                            onCopy={() => {
                                showMessage("info", "Config Copied", 2);
                            }}
                        >
                            <Button icon="copy" noLeftMargin={true} size="small">
                                {`Copy Config`}
                            </Button>
                        </CopyToClipboard>
                    </Col>
                </Row>

                <TextArea rows={6} value={JSON.stringify(this.props.template.config, null, 4)} disabled={true} />

                <Row type="flex" justify="space-between" className="mt-2">
                    <Col>
                        <h4>Override Config</h4>
                    </Col>
                </Row>
                <TextArea rows={8} value={this.state.config} onChange={this.onChange} />
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
                        * this will only update the form fields, template will NOT be saved until clicking the 'Save'
                        button.
                    </small>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const lookupCommissionTypesState = commissionTypesSelector(state);

    return {
        lookupCommissionTypes: lookupCommissionTypesState.items,
    };
};

export default connect(mapStateToProps)(RawConfig);
