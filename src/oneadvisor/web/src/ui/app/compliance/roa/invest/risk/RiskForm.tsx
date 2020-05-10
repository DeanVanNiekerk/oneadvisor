import { Card } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveCaptureMode,
    roaInvestLookupsSelector,
    roaInvestRiskCaptureModeSelector,
} from "@/state/compliance/roa";
import { RiskProfileCaptureMode } from "@/state/compliance/roa/invest/risk/types";
import { Form, FormSelect } from "@/ui/controls";

import RiskProfileManual from "./RiskProfileManual";
import RiskQuestions from "./RiskQuestions";

type Props = PropsFromState & PropsFromDispatch;

const RiskForm: React.FC<Props> = (props) => {
    return (
        <Card>
            <Form layout="vertical">
                <FormSelect<string>
                    fieldName="captureModes"
                    width={"150px"}
                    label="Capture Mode"
                    options={props.captureModes}
                    optionsValue="code"
                    optionsText="name"
                    value={props.captureMode}
                    onChange={(_fieldName, value) =>
                        props.receiveCaptureMode(value as RiskProfileCaptureMode)
                    }
                />
            </Form>

            {props.captureMode === "questionaire" && <RiskQuestions />}
            {props.captureMode === "manual" && <RiskProfileManual />}
        </Card>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const lookupsState = roaInvestLookupsSelector(state);
    return {
        captureModes: lookupsState.riskProfileCaptureModes,
        captureMode: roaInvestRiskCaptureModeSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                receiveCaptureMode,
            },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RiskForm);
