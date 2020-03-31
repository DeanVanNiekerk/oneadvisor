import { Col, Input, Row } from "antd";
import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import {
    commissionStatementTemplateConfigSelector,
    commissionStatementTemplateOverride,
} from "@/state/app/commission/templates";
import { RootState } from "@/state/rootReducer";
import { Button } from "@/ui/controls";
import { showMessage } from "@/ui/feedback/notifcation";

const { TextArea } = Input;

type Props = PropsFromState & PropsFromDispatch;

const RawConfig: React.FC<Props> = ({ config, commissionStatementTemplateOverride }) => {
    if (!config) return <React.Fragment />;

    const [newConfig, setNewConfig] = useState<string>("");

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewConfig(event.target.value);
    };

    return (
        <>
            <Row justify="space-between">
                <Col>
                    <h4>Current Config</h4>
                </Col>
                <Col>
                    <CopyToClipboard
                        text={JSON.stringify(config, null, 4)}
                        onCopy={() => {
                            showMessage("info", "Config Copied", 2);
                        }}
                    >
                        <Button iconName="copy" noLeftMargin={true} size="small">
                            {`Copy Config`}
                        </Button>
                    </CopyToClipboard>
                </Col>
            </Row>

            <TextArea rows={6} value={JSON.stringify(config, null, 4)} disabled={true} />

            <Row justify="space-between" className="mt-2">
                <Col>
                    <h4>Override Config</h4>
                </Col>
            </Row>
            <TextArea rows={8} value={newConfig} onChange={onChange} />
            <Button
                iconName="edit"
                onClick={() => commissionStatementTemplateOverride(newConfig)}
                type="primary"
                noLeftMargin={true}
                disabled={!newConfig}
                className="mt-1"
            >
                {`Override Current Config`}
            </Button>
            {newConfig && (
                <small className="ml-1">
                    {`* this will only update the form fields, template will NOT be saved until clicking the 'Save'
                    button.`}
                </small>
            )}
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    return {
        config: commissionStatementTemplateConfigSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        commissionStatementTemplateOverride: (newConfig: string) => {
            dispatch(commissionStatementTemplateOverride(newConfig, showMessage));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RawConfig);
