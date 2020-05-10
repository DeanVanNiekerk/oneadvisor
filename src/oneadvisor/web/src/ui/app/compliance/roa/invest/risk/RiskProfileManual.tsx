import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveRiskProfileCode,
    roaInvestLookupsSelector,
    roaInvestRiskProfileCodeSelector,
} from "@/state/compliance/roa";
import { RiskProfileCode } from "@/state/compliance/roa/invest/risk/types";
import { Form, FormSelect } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const RiskProfileManual: React.FC<Props> = (props) => {
    return (
        <Form layout="vertical">
            <FormSelect<string>
                fieldName="riskProfiles"
                width={"250px"}
                label="Risk Profile"
                options={props.riskProfiles}
                optionsValue="code"
                optionsText="name"
                value={props.riskProfileCode}
                onChange={(_fieldName, value) =>
                    props.receiveRiskProfileCode(value as RiskProfileCode)
                }
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const lookups = roaInvestLookupsSelector(state);
    return {
        riskProfiles: lookups.riskProfiles,
        riskProfileCode: roaInvestRiskProfileCodeSelector(state),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                receiveRiskProfileCode,
            },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RiskProfileManual);
